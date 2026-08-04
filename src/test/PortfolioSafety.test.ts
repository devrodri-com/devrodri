import { describe, expect, it, vi } from "vitest";
import {
  filters,
  homePortfolioCases,
  isProjectKey,
  portfolioCases,
  projectKeys,
} from "../data/portfolio";
import {
  lemBoxAudienceIntro,
  lemBoxCase,
  lemBoxPublicLinks,
  lemBoxPublicLinksSection,
} from "../data/portfolio/cases/lemBox";
import {
  getPortfolioCoverFit,
  type PortfolioCoverFit,
} from "../data/portfolio/types";
import translations from "../i18n";

interface FileSystemApi {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: "utf8"): string;
  readFileSync(path: string): Uint8Array;
  statSync(path: string): { size: number };
}

interface HashApi {
  update(value: string | Uint8Array): HashApi;
  digest(encoding: "hex"): string;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
}

interface UrlApi {
  fileURLToPath(url: string): string;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const crypto = await vi.importActual<CryptoApi>("node:crypto");
const path = await vi.importActual<PathApi>("node:path");
const url = await vi.importActual<UrlApi>("node:url");
const projectRoot = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../..",
);

const expectedProjectKeys = [
  "lem_box",
  "zentra",
  "esteban",
  "mutter",
  "magenta",
  "federico",
  "boating",
  "campings_demo",
] as const;
const expectedHomeKeys = ["lem_box", "zentra", "esteban", "mutter"];
const expectedCategories = {
  lem_box: "systems",
  zentra: "brand",
  esteban: "web",
  mutter: "ecommerce",
  magenta: "web",
  federico: "web",
  boating: "web",
  campings_demo: "systems",
} as const;
const expectedFilters = [
  { key: "all", label: { es: "Todos", en: "All" } },
  { key: "systems", label: { es: "Sistemas", en: "Systems" } },
  { key: "web", label: { es: "Sitios web", en: "Websites" } },
  { key: "ecommerce", label: { es: "E-commerce", en: "E-commerce" } },
  { key: "brand", label: { es: "Marca", en: "Brand" } },
];
const expectedPreservedCaseHashes = {
  zentra: "50082406905123ed80a6eac63745d3a4a27448825990fdc82b7057d41b4d411a",
  esteban: "643b388f7f34ce4b90e2ba1890b007fef0f2c485694647bf56cc0c04a4c421e4",
  mutter: "aa118ae6042f19d18ec824d988519e28a8a36aef2b94be6a80ec3634dac1ec25",
  magenta: "e705f225be4bb4ea1f0158d65198f206657f7ead2d892e4169902c9df5935c89",
  federico: "bb8a9ebb7529473d3e6952ba0870c16b309559e09b76524abc7e678a92f8145d",
  boating: "7754ed5cab71d070f83f13d70fcd761440018bb2927881ebecb30e6104b2e418",
  campings_demo:
    "25ded1c5d93a2eba7ec3f9a5b81e5b2d634d5d5a4f80c8d64d182dd51f783ad0",
} as const;
const campingsRepository =
  "https://github.com/devrodri-com/reservas-campings-nacionales";
const removedLiveDemo = [
  "https://reservas-campings-nacionales",
  "vercel.app",
].join(".");
const originalCoverContracts = [
  {
    key: "lem_box",
    path: "public/img/lem-box-cover.png",
    dimensions: { width: 1200, height: 630 },
    bytes: 1_256_806,
    hash: "a920605fc287def43c752f2f0fd58f197e2b11440d59c339d7a9084741ed42f5",
  },
  {
    key: "esteban",
    path: "public/img/esteban.png",
    dimensions: { width: 1200, height: 630 },
    bytes: 699_200,
    hash: "86c27874e255decb55e2a4792d43b54318ef64b5eded0edee3dfefad68cdebec",
  },
  {
    key: "federico",
    path: "public/img/federico-cover.jpg",
    dimensions: { width: 1200, height: 630 },
    bytes: 547_400,
    hash: "186cd88d5dfedbb7da4dc197196e309c5e29fcd57c5be1ee8faf3d3cd557b1f5",
  },
  {
    key: "campings_demo",
    path: "public/img/campings-concept-cover.jpg",
    dimensions: { width: 1600, height: 800 },
    bytes: 280_518,
    hash: "e2e8d3adb8861a9f9895ea327ce0151abe5993dffc5eaecc879e61b83640ab82",
  },
] as const;
const lemBoxPortfolioCoverContract = {
  path: "src/assets/portfolio/lem-box/lem-box-portfolio-cover.jpg",
  dimensions: { width: 1920, height: 1440 },
  bytes: 329_873,
  hash: "414c465da87ec113cadda69b488d17905b12e4418c2583b3154f6dcfaf486b6d",
} as const;

function getCase(key: (typeof expectedProjectKeys)[number]) {
  const portfolioCase = portfolioCases.find((item) => item.key === key);
  if (portfolioCase === undefined) {
    throw new Error(`Missing portfolio case: ${key}`);
  }
  return portfolioCase;
}

function digestPublicCase(portfolioCase: (typeof portfolioCases)[number]) {
  const publicValues = {
    key: portfolioCase.key,
    cover: portfolioCase.cover,
    actions: portfolioCase.actions,
    content: portfolioCase.content,
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(publicValues))
    .digest("hex");
}

function byteAt(data: Uint8Array, index: number) {
  const value = data[index];
  if (value === undefined) {
    throw new Error("Unexpected end of JPEG data");
  }
  return value;
}

function readJpegDimensions(data: Uint8Array) {
  if (byteAt(data, 0) !== 0xff || byteAt(data, 1) !== 0xd8) {
    throw new Error("Expected a JPEG image");
  }

  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  let offset = 2;

  while (offset < data.length) {
    if (byteAt(data, offset) !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = byteAt(data, offset + 1);
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }
    if (marker === 0xda) {
      break;
    }

    const segmentLength =
      (byteAt(data, offset) << 8) + byteAt(data, offset + 1);
    if (startOfFrameMarkers.has(marker)) {
      return {
        height:
          (byteAt(data, offset + 3) << 8) + byteAt(data, offset + 4),
        width:
          (byteAt(data, offset + 5) << 8) + byteAt(data, offset + 6),
      };
    }
    if (segmentLength < 2) {
      break;
    }
    offset += segmentLength;
  }

  throw new Error("JPEG dimensions were not found");
}

function readPngDimensions(data: Uint8Array) {
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  expect(Array.from(data.slice(0, pngSignature.length))).toEqual(pngSignature);

  return {
    width:
      (byteAt(data, 16) << 24) |
      (byteAt(data, 17) << 16) |
      (byteAt(data, 18) << 8) |
      byteAt(data, 19),
    height:
      (byteAt(data, 20) << 24) |
      (byteAt(data, 21) << 16) |
      (byteAt(data, 22) << 8) |
      byteAt(data, 23),
  };
}

describe("portfolio architecture invariants", () => {
  it("derives eight unique keys in the exact approved order", () => {
    expect(projectKeys).toEqual(expectedProjectKeys);
    expect(new Set(projectKeys).size).toBe(8);
    expect(portfolioCases.map(({ portfolioOrder }) => portfolioOrder)).toEqual(
      [0, 1, 2, 3, 4, 5, 6, 7],
    );
    expect(projectKeys).not.toContain("lem_web");
    expect(projectKeys).not.toContain("lem_portal");
    expect(isProjectKey("lem_box")).toBe(true);
    expect(isProjectKey("zentra")).toBe(true);
    expect(isProjectKey("toString")).toBe(false);
    expect(isProjectKey("unknown")).toBe(false);
  });

  it("uses the approved category and filter contracts in both languages", () => {
    expect(filters).toEqual(expectedFilters);
    expect(
      Object.fromEntries(
        portfolioCases.map(({ category, key }) => [key, category]),
      ),
    ).toEqual(expectedCategories);

    const categoryFilters = new Set(filters.slice(1).map(({ key }) => key));
    expect(new Set(portfolioCases.map(({ category }) => category))).toEqual(
      categoryFilters,
    );
    expect(
      portfolioCases.every(({ category }) => categoryFilters.has(category)),
    ).toBe(true);
  });

  it("derives exactly four approved home highlights", () => {
    expect(homePortfolioCases.map(({ key }) => key)).toEqual(expectedHomeKeys);
    expect(homePortfolioCases.map(({ home }) => home.order)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it("publishes only the approved LEM-BOX links and claims", () => {
    const lemBox = getCase("lem_box");
    const caseStudy = lemBox.caseStudy;
    const serialized = JSON.stringify(lemBox);

    expect(caseStudy).toBeDefined();
    if (caseStudy === undefined) {
      throw new Error("Missing LEM-BOX case study");
    }
    expect(
      portfolioCases
        .filter((portfolioCase) => portfolioCase.caseStudy !== undefined)
        .map(({ key }) => key),
    ).toEqual(["lem_box"]);
    expect(caseStudy.slug).toBe("lem-box");
    expect(caseStudy.path).toBe("/portfolio/lem-box");
    expect(caseStudy.publicLinks).toBe(lemBox.actions);
    expect(lemBox.actions.map(({ href }) => href)).toEqual([
      "https://lem-box.com",
      "https://lem-box.com.uy",
      "https://lem-box.com.ar",
    ]);
    expect(lemBox.actions[0]?.note).toEqual({
      es: "Plataforma operativa privada. Acceso reservado a clientes, Partners y equipo autorizado de LEM-BOX.",
      en: "Private operations platform. Access restricted to LEM-BOX customers, Partners, and authorized team members.",
    });
    expect(lemBoxPublicLinksSection).toEqual({
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
    });
    expect(
      lemBoxPublicLinks.map(({ href, directory }) => ({ href, directory })),
    ).toEqual([
      {
        href: "https://lem-box.com",
        directory: {
          es: {
            title: "Plataforma central",
            domain: "lem-box.com",
            description:
              "Plataforma operativa privada. Acceso reservado a clientes, Partners y equipo autorizado de LEM-BOX.",
            action: "Abrir plataforma",
          },
          en: {
            title: "Central platform",
            domain: "lem-box.com",
            description:
              "Private operations platform. Access restricted to LEM-BOX customers, Partners, and authorized team members.",
            action: "Open platform",
          },
        },
      },
      {
        href: "https://lem-box.com.uy",
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
    ]);
    expect(serialized).not.toMatch(/\/mi|\/partner|\/admin/);
    expect(serialized).not.toMatch(
      /Stripe|PayPal|Resend|hardening|pagos|comprobantes|facturación|transferencias|payments?|receipts?|billing|invoices?|transfers?/i,
    );
    expect(serialized).not.toMatch(
      /acceso con credenciales|sign-in required|demo credentials?|credenciales? demo|solicitar demo|request (?:a )?demo/i,
    );
    expect(serialized).not.toMatch(
      /crear cuentas|crear usuarios|crear accesos|create accounts|create users|create access|automatic identity creation|global client base|global operations|client deletion|portfolio reassignment/i,
    );
    expect(serialized).not.toMatch(
      /selector multipaís|mobile ready|app móvil en desarrollo|SEO completamente optimizado|canonical perfecto|100 % segura|sin vulnerabilidades|grandes volúmenes sin degradación|coming soon|launch date/i,
    );
    expect(lemBox.category).toBe("systems");
    expect(lemBox.content.es.role).toBe(
      "Fundador, propietario y Operations Manager. Lidero producto, procesos y desarrollo full-stack del ecosistema digital.",
    );
    expect(lemBox.content.en.role).toBe(
      "Founder, owner, and Operations Manager. I lead product, processes, and full-stack development of the digital ecosystem.",
    );
    expect(lemBox.content.es.tags).toEqual([
      "Producto propio · Plataforma operativa",
    ]);
    expect(lemBox.content.en.tags).toEqual([
      "Own product · Operations platform",
    ]);
    expect(lemBox.home).toBeDefined();
    expect(lemBox.home?.summary).toEqual({
      es: "Producto propio que conecta la presencia comercial de LEM-BOX en Uruguay y Argentina con una plataforma central utilizada en su operación logística entre Estados Unidos y ambos mercados.",
      en: "A product built for LEM-BOX's real operation, connecting its commercial presence in Uruguay and Argentina with a central platform used across its logistics workflows between the United States and both markets.",
    });
    expect(caseStudy.content.es.summary).toEqual({
      title: "Un producto conectado a una operación real",
      text: "LEM-BOX es un negocio logístico con más de 10 años de trayectoria. Su ecosistema digital actual forma parte de una evolución más reciente y conecta los sitios comerciales de Uruguay y Argentina con una plataforma central utilizada por clientes, partners y el equipo operativo.",
      clarification: "",
    });
    expect(caseStudy.content.en.summary).toEqual({
      title: "A product connected to a real operation",
      text: "LEM-BOX is a logistics business with more than 10 years of experience. Its current digital ecosystem is part of a more recent evolution and connects the commercial websites for Uruguay and Argentina with a central platform used by customers, partners, and the operations team.",
      clarification: "",
    });
    expect(caseStudy.content.es.challenge).toEqual({
      title: "El desafío",
      text: "La operación necesitaba continuidad entre la captación comercial, la recepción y consolidación de paquetes, los embarques, el tracking y la atención. El desafío no era crear una web aislada, sino conectar mercados, usuarios y procesos en un producto alineado con la operación real.",
    });
    expect(caseStudy.content.en.challenge).toEqual({
      title: "The challenge",
      text: "The operation needed continuity across customer acquisition, package intake and consolidation, shipments, tracking, and support. The challenge was not to build an isolated website, but to connect markets, users, and processes through a product aligned with the real operation.",
    });
    expect(lemBoxAudienceIntro).toEqual({
      es: "Cada persona accede a la información y las acciones necesarias para su parte de la operación.",
      en: "Each person accesses the information and actions needed for their part of the operation.",
    });
    expect(caseStudy.content.es.ecosystem.items[2]).toEqual({
      title: "Operación conectada",
      text: "La plataforma acompaña procesos de recepción de paquetes, evidencia fotográfica, peso, asignación, consolidación en cajas, embarques, tracking y actualización de estados.",
    });
    expect(caseStudy.content.en.ecosystem.items[2]).toEqual({
      title: "Connected operations",
      text: "The platform supports package intake, photo evidence, weight, assignment, box consolidation, shipments, tracking, and status updates.",
    });
    expect(caseStudy.content.es.audiences.items).toEqual([
      {
        title: "Clientes",
        text: "Consultan sus paquetes, tracking, fotografías, peso, cajas, embarques y estados operativos. También pueden informar un tracking esperado antes de que el paquete sea recibido.",
      },
      {
        title: "Partner LEM-BOX",
        text: "Administra una cartera asignada de clientes desde una sola cuenta. Puede crear y mantener registros asociados y consultar sus trackings, cajas y embarques dentro de una experiencia multi-cliente.",
      },
      {
        title: "Equipo operativo",
        text: "Registra paquetes, peso y evidencia fotográfica, asigna paquetes a clientes, consolida cajas, organiza embarques y actualiza estados para acompañar cada etapa del recorrido.",
      },
    ]);
    expect(caseStudy.content.en.audiences.items).toEqual([
      {
        title: "Customers",
        text: "They can view their packages, tracking, photos, weight, boxes, shipments, and operational statuses. They can also report an expected tracking number before the package is received.",
      },
      {
        title: "LEM-BOX Partner",
        text: "They manage an assigned customer portfolio from a single account. They can create and maintain associated records and view their tracking, boxes, and shipments through a multi-customer experience.",
      },
      {
        title: "Operations team",
        text: "They register packages, weight, and photo evidence, assign packages to customers, consolidate boxes, organize shipments, and update statuses throughout the journey.",
      },
    ]);
    expect(caseStudy.content.es.role).toEqual({
      title: "Mi rol",
      text: "Mi trabajo parte de la operación diaria: traduzco necesidades reales en prioridades de producto, flujos y funcionalidades, y llevo esas decisiones hasta la implementación y evolución técnica del ecosistema.",
    });
    expect(caseStudy.content.en.role).toEqual({
      title: "My role",
      text: "My work starts with day-to-day operations: I turn real needs into product priorities, workflows, and features, and carry those decisions through implementation and the ecosystem's technical evolution.",
    });
    expect(caseStudy.content.es.architecture).toEqual({
      title: "Base técnica",
      text: "La arquitectura combina interfaces web, autenticación, datos, archivos y despliegues en una base preparada para evolucionar junto con el producto.",
      stackLabel: "Tecnologías principales",
    });
    expect(caseStudy.content.en.architecture).toEqual({
      title: "Technical foundation",
      text: "The architecture combines web interfaces, authentication, data, files, and deployments on a foundation designed to evolve with the product.",
      stackLabel: "Core technologies",
    });
    expect(caseStudy.content.es.markets).toEqual({
      title: "Una operación, tres mercados",
      text: "La operación logística se desarrolla en Estados Unidos, mientras Uruguay y Argentina cuentan con experiencias comerciales adaptadas a cada mercado y conectadas al mismo ecosistema operativo.",
    });
    expect(caseStudy.content.en.markets).toEqual({
      title: "One operation, three markets",
      text: "The logistics operation is based in the United States, while Uruguay and Argentina have commercial experiences tailored to each market and connected to the same operational ecosystem.",
    });
    expect(caseStudy.content.es.evolution).toEqual({
      title: "Un producto que evoluciona con la operación",
      text: "LEM-BOX continúa adaptándose a los procesos, necesidades y prioridades reales del negocio.",
      qualityTitle: "Calidad y reducción de riesgo",
      qualityText: "LEM-BOX cuenta con autenticación, controles de autorización según el perfil y pruebas automatizadas. Su documentación, sus validaciones y la calidad técnica continúan evolucionando.",
    });
    expect(caseStudy.content.en.evolution).toEqual({
      title: "A product that evolves with the operation",
      text: "LEM-BOX continues adapting to the real processes, needs, and priorities of the business.",
      qualityTitle: "Quality and risk reduction",
      qualityText: "LEM-BOX includes authentication, profile-based authorization controls, and automated tests. Its documentation, validation practices, and technical quality continue to evolve.",
    });
    expect(caseStudy.content.es.mobileFuture).toEqual({
      title: "Siguiente etapa",
      text: "La plataforma web continúa activa y sigue evolucionando con documentación, pruebas y mejoras técnicas. Se evalúa una futura experiencia móvil para clientes. No hay una aplicación para Android o iOS disponible actualmente.",
    });
    expect(caseStudy.content.en.mobileFuture).toEqual({
      title: "Next stage",
      text: "The web platform remains active and continues to evolve through documentation, testing, and technical improvements. A future mobile experience for customers is being evaluated. No Android or iOS app is currently available.",
    });
    expect(caseStudy.content.es.currentState).toEqual({
      title: "ESTADO ACTUAL · PRODUCTO ACTIVO",
      text: "",
    });
    expect(caseStudy.content.en.currentState).toEqual({
      title: "CURRENT STATUS · ACTIVE PRODUCT",
      text: "",
    });
    expect(caseStudy.stack).toEqual([
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase Authentication",
      "Cloud Firestore",
      "Firebase Storage",
      "Vercel",
    ]);
    expect(serialized).not.toContain(
      "Los más de 10 años corresponden a la trayectoria del negocio",
    );
    expect(serialized).not.toContain(
      "The more than 10 years refer to the business's trajectory",
    );
    for (const supersededCopy of [
      "Estados Unidos, Uruguay y Argentina",
      "The United States, Uruguay, and Argentina",
      "Un producto en evolución continua",
      "A product in continuous evolution",
      "Próxima evolución",
      "Next evolution",
      "Producto activo en documentación, pruebas y evolución continua.",
      "Active product in continuous documentation, testing, and evolution.",
    ]) {
      expect(
        JSON.stringify({
          markets: caseStudy.content.es.markets,
          marketsEn: caseStudy.content.en.markets,
          evolution: caseStudy.content.es.evolution,
          evolutionEn: caseStudy.content.en.evolution,
          mobileFuture: caseStudy.content.es.mobileFuture,
          mobileFutureEn: caseStudy.content.en.mobileFuture,
          currentState: caseStudy.content.es.currentState,
          currentStateEn: caseStudy.content.en.currentState,
        }),
      ).not.toContain(supersededCopy);
    }
    expect(Object.keys(caseStudy.content.es).sort()).toEqual(
      Object.keys(caseStudy.content.en).sort(),
    );
    for (const sectionKey of [
      "header",
      "summary",
      "challenge",
      "role",
      "ecosystem",
      "audiences",
      "solution",
      "architecture",
      "markets",
      "evolution",
      "mobileFuture",
      "currentState",
      "finalCta",
    ] as const) {
      expect(Object.keys(caseStudy.content.es[sectionKey]).sort()).toEqual(
        Object.keys(caseStudy.content.en[sectionKey]).sort(),
      );
    }
  });

  it("keeps the exact original Portfolio covers unchanged", () => {
    for (const contract of originalCoverContracts) {
      const coverPath = path.join(projectRoot, contract.path);
      const coverData = fs.readFileSync(coverPath);
      const dimensions = contract.path.endsWith(".png")
        ? readPngDimensions(coverData)
        : readJpegDimensions(coverData);

      expect(fs.existsSync(coverPath)).toBe(true);
      expect(dimensions).toEqual(contract.dimensions);
      expect(fs.statSync(coverPath).size).toBe(contract.bytes);
      expect(
        crypto.createHash("sha256").update(coverData).digest("hex"),
      ).toBe(contract.hash);
    }
  });

  it("declares ordered responsive Portfolio assets with explicit fit contracts", () => {
    const approvedFits = ["cover", "contain"] as const satisfies readonly PortfolioCoverFit[];
    const contracts = [
      {
        key: "lem_box",
        fallback: "/img/lem-box-cover.png",
        directory: "src/assets/lem-box",
        stem: "lem-box",
        dimensions: { width: 1200, height: 630 },
        widths: [480, 768, 1200],
        declaredFit: undefined,
        effectiveFit: "contain",
      },
      {
        key: "esteban",
        fallback: "/img/esteban.png",
        directory: "src/assets/portfolio/esteban",
        stem: "esteban",
        dimensions: { width: 1200, height: 630 },
        widths: [480, 768, 1200],
        declaredFit: "cover",
        effectiveFit: "cover",
      },
      {
        key: "federico",
        fallback: "/img/federico-cover.jpg",
        directory: "src/assets/portfolio/federico",
        stem: "federico",
        dimensions: { width: 1200, height: 630 },
        widths: [480, 768, 1200],
        declaredFit: "cover",
        effectiveFit: "cover",
      },
      {
        key: "campings_demo",
        fallback: "/img/campings-concept-cover.jpg",
        directory: "src/assets/portfolio/campings",
        stem: "campings-concept",
        dimensions: { width: 1600, height: 800 },
        widths: [480, 768, 1200, 1600],
        declaredFit: "cover",
        effectiveFit: "cover",
      },
    ] as const;

    expect(approvedFits).toEqual(["cover", "contain"]);
    expect(getPortfolioCoverFit(undefined)).toBe("cover");
    expect(
      portfolioCases
        .filter(({ responsiveCover }) => responsiveCover !== undefined)
        .map(({ key }) => key),
    ).toEqual(["lem_box", "esteban", "federico", "campings_demo"]);

    for (const contract of contracts) {
      const portfolioCase = getCase(contract.key);
      const responsiveCover = portfolioCase.responsiveCover;
      if (responsiveCover === undefined) {
        throw new Error(`Missing responsive cover: ${contract.key}`);
      }

      expect(portfolioCase.cover).toBe(contract.fallback);
      expect({
        width: responsiveCover.width,
        height: responsiveCover.height,
      }).toEqual(contract.dimensions);
      expect(responsiveCover.fit).toBe(contract.declaredFit);
      expect(getPortfolioCoverFit(responsiveCover)).toBe(
        contract.effectiveFit,
      );
      expect(Object.keys(responsiveCover.sources)).toEqual(["avif", "webp"]);

      for (const format of ["avif", "webp"] as const) {
        const candidates = responsiveCover.sources[format];
        expect(candidates.map(({ width }) => width)).toEqual(contract.widths);

        for (const candidate of candidates) {
          const fileName = `${contract.stem}-${candidate.width}.${format}`;
          expect(candidate.src).toContain(fileName);
          const assetPath = path.join(
            projectRoot,
            contract.directory,
            fileName,
          );
          expect(fs.existsSync(assetPath)).toBe(true);
          expect(fs.statSync(assetPath).size).toBeGreaterThan(0);
        }
      }
    }

    const responsiveCover = lemBoxCase.responsiveCover;
    if (responsiveCover === undefined) {
      throw new Error("Missing responsive LEM-BOX cover");
    }
    expect({
      width: lemBoxCase.caseStudy.coverWidth,
      height: lemBoxCase.caseStudy.coverHeight,
    }).toEqual({ width: 1200, height: 630 });
  });

  it("isolates Rodrigo's exact LEM-BOX cover to the full-bleed Portfolio card", () => {
    const coverPath = path.join(projectRoot, lemBoxPortfolioCoverContract.path);
    const coverData = fs.readFileSync(coverPath);
    const portfolioCardCover = lemBoxCase.portfolioCardCover;
    if (portfolioCardCover === undefined) {
      throw new Error("Missing Portfolio-only LEM-BOX cover");
    }

    expect(readJpegDimensions(coverData)).toEqual(
      lemBoxPortfolioCoverContract.dimensions,
    );
    expect(fs.statSync(coverPath).size).toBe(
      lemBoxPortfolioCoverContract.bytes,
    );
    expect(
      crypto.createHash("sha256").update(coverData).digest("hex"),
    ).toBe(lemBoxPortfolioCoverContract.hash);
    expect(portfolioCardCover.cover).toContain(
      "lem-box-portfolio-cover.jpg",
    );
    expect(portfolioCardCover.fullBleed).toBe(true);
    expect(portfolioCardCover.objectPosition).toBe("center 55%");
    expect(portfolioCardCover.sizes).toBe(
      "(min-width: 1280px) 513px, (min-width: 768px) calc(41.67vw - 21px), calc(100vw - 50px)",
    );
    expect(portfolioCardCover.responsiveCover.fit).toBe("cover");
    expect(getPortfolioCoverFit(portfolioCardCover.responsiveCover)).toBe(
      "cover",
    );
    expect({
      width: portfolioCardCover.responsiveCover.width,
      height: portfolioCardCover.responsiveCover.height,
    }).toEqual(lemBoxPortfolioCoverContract.dimensions);

    for (const format of ["avif", "webp"] as const) {
      const candidates = portfolioCardCover.responsiveCover.sources[format];
      expect(candidates.map(({ width }) => width)).toEqual([
        480, 768, 1200, 1600,
      ]);
      for (const candidate of candidates) {
        const assetPath = path.join(
          projectRoot,
          `src/assets/portfolio/lem-box/lem-box-portfolio-cover-${candidate.width}.${format}`,
        );
        expect(fs.existsSync(assetPath)).toBe(true);
        expect(fs.statSync(assetPath).size).toBeGreaterThan(0);
      }
    }

    expect(lemBoxCase.cover).toBe("/img/lem-box-cover.png");
    expect(getPortfolioCoverFit(lemBoxCase.responsiveCover)).toBe("contain");
    expect(lemBoxCase.caseStudy.coverWidth).toBe(1200);
    expect(lemBoxCase.caseStudy.coverHeight).toBe(630);
  });

  it("publishes ZENTRA without private documents or restricted names", () => {
    const zentra = getCase("zentra");
    const serialized = JSON.stringify(zentra);

    expect(zentra.actions.map(({ href }) => href)).toEqual([
      "https://zentrascent.com",
    ]);
    expect(serialized).not.toMatch(
      /ESSENZA|Andrés|Artemov|Manual de imagen|Brand & Growth Plan|Google Workspace|\.pdf/i,
    );
    expect(zentra.content.es.role).toBeDefined();
    expect(zentra.content.en.role).toBeDefined();
  });

  it("keeps the approved ZENTRA cover within its exact asset budget", () => {
    const coverPath = path.join(projectRoot, "public/img/zentra-cover.jpg");

    expect(fs.existsSync(coverPath)).toBe(true);
    expect(readJpegDimensions(fs.readFileSync(coverPath))).toEqual({
      width: 1600,
      height: 800,
    });
    expect(fs.statSync(coverPath).size).toBeLessThanOrEqual(300_000);
  });

  it("keeps Campings last, conceptual, not featured, and GitHub-only", () => {
    const campings = getCase("campings_demo");

    expect(portfolioCases[portfolioCases.length - 1]?.key).toBe(
      "campings_demo",
    );
    expect(campings.home).toBeUndefined();
    expect(campings.actions.map(({ href }) => href)).toEqual([
      campingsRepository,
    ]);
    expect(campings.content.es.status).toBe(
      translations.es.portfolio.campings_demo.status,
    );
    expect(campings.content.es.disclaimer).toBe(
      translations.es.portfolio.campings_demo.disclaimer,
    );
    expect(campings.content.en.status).toBe(
      translations.en.portfolio.campings_demo.status,
    );
    expect(campings.content.en.disclaimer).toBe(
      translations.en.portfolio.campings_demo.disclaimer,
    );
    expect(JSON.stringify({ portfolioCases, translations })).not.toContain(
      removedLiveDemo,
    );
  });

  it("preserves the six existing cases outside approved metadata changes", () => {
    for (const [key, expectedHash] of Object.entries(
      expectedPreservedCaseHashes,
    )) {
      const portfolioCase = portfolioCases.find((item) => item.key === key);
      expect(portfolioCase).toBeDefined();
      if (portfolioCase === undefined) {
        throw new Error(`Missing preserved portfolio case: ${key}`);
      }
      expect(digestPublicCase(portfolioCase)).toBe(expectedHash);
    }
  });

  it("keeps ES and EN structures aligned without long public dashes", () => {
    for (const portfolioCase of portfolioCases) {
      expect(Object.keys(portfolioCase.content.es).sort()).toEqual(
        Object.keys(portfolioCase.content.en).sort(),
      );
      const esDetails = portfolioCase.content.es.details;
      const enDetails = portfolioCase.content.en.details;
      expect(esDetails === undefined).toBe(enDetails === undefined);
      if (esDetails !== undefined && enDetails !== undefined) {
        expect(Object.keys(esDetails).sort()).toEqual(
          Object.keys(enDetails).sort(),
        );
      }
    }

    expect(
      JSON.stringify([getCase("lem_box"), getCase("zentra")]),
    ).not.toMatch(/[—–]/);
  });

  it("locks full Portfolio geometry without suppressing card content", () => {
    const portfolioCardSource = fs.readFileSync(
      path.join(
        projectRoot,
        "src/Components/portfolio/PortfolioCard.tsx",
      ),
      "utf8",
    );

    expect(portfolioCases).toHaveLength(8);
    expect(portfolioCardSource).toContain(
      'expanded ? "" : "lg:h-[360px]"',
    );
    expect(portfolioCardSource).toContain(
      'className="flex flex-col md:flex-row lg:h-full"',
    );
    expect(portfolioCardSource).toContain(
      "lg:h-full lg:aspect-auto",
    );
    expect(portfolioCardSource).toContain(
      'className="p-6 md:w-7/12 lg:flex lg:h-full lg:flex-col"',
    );
    expect(portfolioCardSource).toContain(
      "lg:mt-auto lg:pt-4",
    );
    expect(portfolioCardSource).toContain("inline-flex self-start");
    expect(portfolioCardSource).toContain("aspect-[16/9]");
    expect(portfolioCardSource).not.toContain("md:h-[280px]");
    expect(portfolioCardSource).not.toMatch(
      /line-clamp|\btruncate\b|text-overflow|md:overflow-hidden/,
    );
  });

  it("preserves Portfolio actions, fits, Home, no-JS, Motion, and package boundaries", () => {
    const portfolioCardSource = fs.readFileSync(
      path.join(
        projectRoot,
        "src/Components/portfolio/PortfolioCard.tsx",
      ),
      "utf8",
    );
    const portfolioPageSource = fs.readFileSync(
      path.join(projectRoot, "src/pages/PortfolioPage.tsx"),
      "utf8",
    );
    const portfolioSectionSource = fs.readFileSync(
      path.join(projectRoot, "src/Components/PortfolioSection.tsx"),
      "utf8",
    );
    const fileHashes = Object.fromEntries(
      [
        "package.json",
        "package-lock.json",
        "src/pages/PortfolioPage.tsx",
        "src/Components/PortfolioSection.tsx",
      ].map((file) => [
        file,
        crypto
          .createHash("sha256")
          .update(fs.readFileSync(path.join(projectRoot, file), "utf8"))
          .digest("hex"),
      ]),
    );

    expect(
      Object.fromEntries(
        portfolioCases.map((portfolioCase) => [
          portfolioCase.key,
          portfolioCase.actions.map(({ href }) => href),
        ]),
      ),
    ).toEqual({
      lem_box: [
        "https://lem-box.com",
        "https://lem-box.com.uy",
        "https://lem-box.com.ar",
      ],
      zentra: ["https://zentrascent.com"],
      esteban: ["https://estebanfirpo.com"],
      mutter: ["https://www.muttergames.com"],
      magenta: ["https://magenta-paysandu-m5in.vercel.app"],
      federico: ["https://www.federicoroma.com"],
      boating: ["https://www.boatingadventuresmiami.com"],
      campings_demo: [campingsRepository],
    });
    expect(
      Object.fromEntries(
        portfolioCases.map((portfolioCase) => [
          portfolioCase.key,
          getPortfolioCoverFit(portfolioCase.responsiveCover),
        ]),
      ),
    ).toEqual({
      lem_box: "contain",
      zentra: "cover",
      esteban: "cover",
      mutter: "cover",
      magenta: "cover",
      federico: "cover",
      boating: "cover",
      campings_demo: "cover",
    });
    expect(portfolioCardSource).toContain("data-nojs-visible");
    expect(portfolioCardSource).toContain(
      "initial={{ opacity: 0, y: 20 }}",
    );
    expect(portfolioCardSource).toContain(
      "whileInView={{ opacity: 1, y: 0 }}",
    );
    expect(portfolioCardSource).toContain(
      "transition={{ duration: 0.45 }}",
    );
    expect(portfolioCardSource).toContain("viewport={{ once: true }}");
    expect(portfolioPageSource.match(/data-nojs-hide/g) ?? []).toHaveLength(2);
    expect(portfolioSectionSource).not.toContain("<motion.section");
    expect(fileHashes).toEqual({
      "package.json":
        "826b5b8d943491f5482a96266b5d5b7aea8ec47ea00630aa567ba757e8acb43e",
      "package-lock.json":
        "762aafad2219fddf1ab53b99879359da27f18c62f31ee8a3f411b45081381d3b",
      "src/pages/PortfolioPage.tsx":
        "5c2f248ed582eace7bc37663e844879b6374cf18b3456e54998c7477d0980c2d",
      "src/Components/PortfolioSection.tsx":
        "8f5cae48ef7226c453a4b993b6be408b888ab0d6dc11c12b9029178a000b98dc",
    });
  });

  it("uses explicit card slots and a stable FAQ key contract", () => {
    const portfolioCardSource = fs.readFileSync(
      path.join(
        projectRoot,
        "src/Components/portfolio/PortfolioCard.tsx",
      ),
      "utf8",
    );
    const portfolioSectionSource = fs.readFileSync(
      path.join(projectRoot, "src/Components/PortfolioSection.tsx"),
      "utf8",
    );
    const portfolioTypesSource = fs.readFileSync(
      path.join(projectRoot, "src/data/portfolio/types.ts"),
      "utf8",
    );
    const faqSource = fs.readFileSync(
      path.join(projectRoot, "src/Components/FaqSection.tsx"),
      "utf8",
    );

    expect(portfolioCardSource).toContain("actions: ReactNode");
    expect(portfolioCardSource).toContain("details: ReactNode");
    expect(portfolioCardSource).not.toContain("Children.toArray");
    expect(portfolioCardSource).not.toContain("isValidElement");
    expect(portfolioCardSource).not.toContain("className?.includes");
    expect(portfolioCardSource).toContain(
      "getPortfolioCoverFit(responsiveCover)",
    );
    expect(portfolioSectionSource).toContain(
      "getPortfolioCoverFit(portfolioCase.responsiveCover)",
    );
    expect(portfolioCardSource).not.toMatch(/object-\$\{/);
    expect(portfolioSectionSource).not.toMatch(/object-\$\{/);
    expect(portfolioTypesSource).toContain(
      'export type PortfolioCoverFit = "cover" | "contain";',
    );
    expect(portfolioTypesSource).toContain(
      'return responsiveCover.fit ?? "contain";',
    );
    expect(portfolioTypesSource).not.toContain("fit?: string");
    expect(portfolioTypesSource).not.toMatch(
      /responsiveCover\.(?:key|cover|path|file)/,
    );
    expect(faqSource).toContain("const FAQ_KEYS");
    for (const key of [
      "projectTypes",
      "projectStart",
      "websiteVsSystem",
      "phasedWork",
      "websiteCapabilities",
      "automations",
      "brandDevelopment",
      "budgetAndPayment",
      "postLaunch",
    ]) {
      expect(faqSource).toContain(`"${key}"`);
    }
    expect(faqSource).not.toContain("extraFaq");
    expect(faqSource).not.toContain("techAnswer");
    expect(faqSource).not.toMatch(/questions\[\d+\]/);
  });
});
