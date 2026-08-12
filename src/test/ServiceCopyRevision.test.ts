import { describe, expect, it, vi } from "vitest";
import translations from "../i18n";
import { portfolioCases } from "../data/portfolio";

interface FileSystemApi {
  readFileSync(path: string, encoding: "utf8"): string;
}
interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
}
interface UrlApi {
  fileURLToPath(url: string): string;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const path = await vi.importActual<PathApi>("node:path");
const url = await vi.importActual<UrlApi>("node:url");
const projectRoot = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../..",
);

const approvedParentheticalEs =
  "Si el objetivo es presencia, consultas o ventas (y no gestionar una operación), probablemente alcance con un sitio web profesional.";
const approvedParentheticalEn =
  "If the goal is presence, inquiries, or sales (not managing an operation), a professional business website is probably enough.";

const forbiddenZentraClaims =
  /sitio terminado|producción completa|e-commerce ya publicado|suscripciones ya activas|clientes|ventas|métricas|fecha de lanzamiento|finished website|full production|already live|already published|subscriptions are active|launch date|customers|sales figures/i;

describe("SEO-COM-01 copy revision contract", () => {
  it("has zero em dashes in the six commercial service routes", () => {
    const esServicesPages = JSON.stringify(translations.es.servicesPages);
    const enServicesPages = JSON.stringify(translations.en.servicesPages);

    expect(esServicesPages).not.toMatch(/—/);
    expect(enServicesPages).not.toMatch(/—/);
  });

  it("uses the exact approved parenthetical sentence in ES and EN", () => {
    expect(translations.es.servicesPages.systems.crossLink.text).toBe(
      approvedParentheticalEs,
    );
    expect(translations.en.servicesPages.systems.crossLink.text).toBe(
      approvedParentheticalEn,
    );
  });

  it("lists exactly six website proofs in the approved order", () => {
    const esItems = translations.es.servicesPages.web.cases.items;
    const enItems = translations.en.servicesPages.web.cases.items;

    expect(esItems).toHaveLength(6);
    expect(enItems).toHaveLength(6);
    expect(esItems.map(({ name }) => name)).toEqual([
      "Jacquie Zárate · Real Estate e Inversión",
      "Mutter Games",
      "Esteban Firpo · Miami Real Estate",
      "Imprenta Magenta",
      "ZENTRA Scent",
      "Federico Roma",
    ]);
    expect(enItems.map(({ name }) => name)).toEqual([
      "Jacquie Zárate · Real Estate & Investment",
      "Mutter Games",
      "Esteban Firpo · Miami Real Estate",
      "Imprenta Magenta",
      "ZENTRA Scent",
      "Federico Roma",
    ]);

    for (const items of [esItems, enItems]) {
      expect(new Set(items.map(({ name }) => name)).size).toBe(6);
      expect(items.filter(({ name }) => name.includes("Jacquie"))).toHaveLength(
        1,
      );
      expect(items.some(({ name }) => name.includes("Esteban"))).toBe(true);
      expect(items.some(({ name }) => name.includes("Federico"))).toBe(true);
      expect(items.some(({ name }) => name.includes("Boating"))).toBe(false);
      expect(items.every(({ text }) => text.trim().length > 0)).toBe(true);
    }
  });

  it("uses the revised intro while keeping the approved heading", () => {
    expect(translations.es.servicesPages.web.cases.title).toBe("Sitios reales");
    expect(translations.en.servicesPages.web.cases.title).toBe("Real websites");
    expect(translations.es.servicesPages.web.cases.intro).toBe(
      "Algunos de los sitios que diseñé y desarrollé para empresas y marcas personales:",
    );
    expect(translations.en.servicesPages.web.cases.intro).toBe(
      "Some of the websites I designed and developed for businesses and personal brands:",
    );
  });

  it("reuses the existing copy for every non-Jacquie website proof", () => {
    const esItems = translations.es.servicesPages.web.cases.items;
    const enItems = translations.en.servicesPages.web.cases.items;
    const esText = (name: string) =>
      esItems.find((item) => item.name === name)?.text;
    const enText = (name: string) =>
      enItems.find((item) => item.name === name)?.text;

    expect(esText("Jacquie Zárate · Real Estate e Inversión")).toBe(
      "Sitio inmobiliario trilingüe con catálogo de preconstrucción filtrable, SEO por idioma y contacto directo por WhatsApp.",
    );
    expect(enText("Jacquie Zárate · Real Estate & Investment")).toBe(
      "Trilingual real estate site with a filterable pre-construction catalog, per-language SEO, and direct WhatsApp contact.",
    );
    expect(esText("Mutter Games")).toBe(
      "E-commerce con catálogo dinámico y checkout con Mercado Pago.",
    );
    expect(enText("Mutter Games")).toBe(
      "E-commerce with a dynamic catalog and Mercado Pago checkout.",
    );
    expect(esText("Esteban Firpo · Miami Real Estate")).toBe(
      "Sitio inmobiliario bilingüe con catálogo de proyectos e integración con WhatsApp.",
    );
    expect(enText("Esteban Firpo · Miami Real Estate")).toBe(
      "Bilingual real-estate site with a project catalog and WhatsApp integration.",
    );
    expect(esText("ZENTRA Scent")).toBe(
      "Proyecto en desarrollo: sitio web y e-commerce con suscripciones, panel administrativo y gestión de stock.",
    );
    expect(enText("ZENTRA Scent")).toBe(
      "In development: website and e-commerce with subscriptions, an admin panel, and inventory management.",
    );
  });

  it("describes Federico only with his canonical Portfolio content", () => {
    const esFederico = translations.es.servicesPages.web.cases.items.find(
      ({ name }) => name === "Federico Roma",
    );
    const enFederico = translations.en.servicesPages.web.cases.items.find(
      ({ name }) => name === "Federico Roma",
    );

    expect(esFederico?.text).toBe(
      "Sitio web personal y profesional con biografía, cursos en video, fotografías y productos exclusivos.",
    );
    expect(enFederico?.text).toBe(
      "Personal and professional website with biography, video courses, photography, and exclusive products.",
    );
    // Every claim is already carried by the canonical Portfolio entry.
    for (const [summary, canonical] of [
      [esFederico?.text ?? "", translations.es.portfolio.federico.desc],
      [enFederico?.text ?? "", translations.en.portfolio.federico.desc],
    ] as const) {
      expect(canonical).toMatch(/biograf|biography/i);
      expect(canonical).toMatch(/cursos en video|video courses/i);
      expect(canonical).toMatch(/productos exclusivos|exclusive products/i);
      expect(summary).not.toMatch(
        /\d|campe[óo]n|champion|ranking|ventas|sales|conversi/i,
      );
    }
  });

  it("preserves Magenta's existing factual qualifier", () => {
    const esMagenta = translations.es.servicesPages.web.cases.items.find(
      ({ name }) => name === "Imprenta Magenta",
    );
    const enMagenta = translations.en.servicesPages.web.cases.items.find(
      ({ name }) => name === "Imprenta Magenta",
    );

    expect(esMagenta?.text).toBe(
      "Catálogo optimizado con formulario dinámico de cotización. MVP funcional ya activo.",
    );
    expect(enMagenta?.text).toBe(
      "Optimized catalog with a dynamic quote form. Functional MVP currently live.",
    );
  });

  it("marks ZENTRA as in development, backed by the approved scope, without finished-product claims", () => {
    const esZentra = translations.es.servicesPages.web.cases.items.find(
      ({ name }) => name === "ZENTRA Scent",
    );
    const enZentra = translations.en.servicesPages.web.cases.items.find(
      ({ name }) => name === "ZENTRA Scent",
    );

    expect(esZentra?.text).toBe(
      "Proyecto en desarrollo: sitio web y e-commerce con suscripciones, panel administrativo y gestión de stock.",
    );
    expect(enZentra?.text).toBe(
      "In development: website and e-commerce with subscriptions, an admin panel, and inventory management.",
    );

    expect(esZentra?.text).toMatch(/en desarrollo/i);
    expect(enZentra?.text).toMatch(/in development/i);
    expect(esZentra?.text).toMatch(/e-commerce/i);
    expect(esZentra?.text).toMatch(/suscripciones/i);
    expect(esZentra?.text).toMatch(/panel administrativo/i);
    expect(esZentra?.text).toMatch(/stock/i);
    expect(enZentra?.text).toMatch(/e-commerce/i);
    expect(enZentra?.text).toMatch(/subscriptions/i);
    expect(enZentra?.text).toMatch(/admin panel/i);
    expect(enZentra?.text).toMatch(/inventory/i);

    expect(esZentra?.text).not.toMatch(forbiddenZentraClaims);
    expect(enZentra?.text).not.toMatch(forbiddenZentraClaims);
  });

  it("keeps Boating available in the Portfolio even though it left the website proof list", () => {
    const boating = portfolioCases.find(({ key }) => key === "boating");
    expect(boating).toBeDefined();
    expect(boating?.content.es.title).toBe("Boating Adventures Miami");
    expect(boating?.content.en.title).toBe("Boating Adventures Miami");
  });

  it("reuses a real internal Portfolio link for proof cases, without inventing a ZENTRA route", () => {
    const businessWebsitesPageSource = fs.readFileSync(
      path.join(projectRoot, "src/pages/BusinessWebsitesPage.tsx"),
      "utf8",
    );

    expect(businessWebsitesPageSource).toContain(
      'getLocalizedPath("portfolio", language)',
    );
    expect(businessWebsitesPageSource).not.toContain("/portfolio/zentra");
    expect(businessWebsitesPageSource).not.toContain("#zentra");
  });
});
