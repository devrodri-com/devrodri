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

  it("keeps the four featured website cases with ZENTRA replacing Boating", () => {
    const esItems = translations.es.servicesPages.web.cases.items;
    const enItems = translations.en.servicesPages.web.cases.items;

    expect(esItems.map(({ name }) => name)).toEqual([
      "Esteban Firpo · Miami Real Estate",
      "Mutter Games",
      "Imprenta Magenta",
      "ZENTRA Scent",
    ]);
    expect(enItems.map(({ name }) => name)).toEqual([
      "Esteban Firpo · Miami Real Estate",
      "Mutter Games",
      "Imprenta Magenta",
      "ZENTRA Scent",
    ]);
    expect(esItems.some(({ name }) => name.includes("Boating"))).toBe(false);
    expect(enItems.some(({ name }) => name.includes("Boating"))).toBe(false);
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
