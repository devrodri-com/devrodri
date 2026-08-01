import { describe, expect, it } from "vitest";
import {
  PUBLIC_ROUTES,
  SITE_ORIGIN,
  getEquivalentLocalePath,
  getLocalizedPath,
  getNotFoundMetadata,
  getPublicRoute,
  normalizePathname,
} from "../routes/siteRoutes";

const expectedRoutes = [
  {
    routeKey: "home:es",
    locale: "es",
    pathname: "/",
    equivalentLocalePath: "/en",
    page: "home",
  },
  {
    routeKey: "home:en",
    locale: "en",
    pathname: "/en",
    equivalentLocalePath: "/",
    page: "home",
  },
  {
    routeKey: "portfolio:es",
    locale: "es",
    pathname: "/portfolio",
    equivalentLocalePath: "/en/portfolio",
    page: "portfolio",
  },
  {
    routeKey: "portfolio:en",
    locale: "en",
    pathname: "/en/portfolio",
    equivalentLocalePath: "/portfolio",
    page: "portfolio",
  },
  {
    routeKey: "lem-box:es",
    locale: "es",
    pathname: "/portfolio/lem-box",
    equivalentLocalePath: "/en/portfolio/lem-box",
    page: "lem-box",
  },
  {
    routeKey: "lem-box:en",
    locale: "en",
    pathname: "/en/portfolio/lem-box",
    equivalentLocalePath: "/portfolio/lem-box",
    page: "lem-box",
  },
] as const;

const expectedCommercialMetadata = {
  "home:es": {
    title: "Rodrigo Opalo | Sitios, sistemas y automatización",
    description:
      "Desarrollo sitios, aplicaciones y sistemas a medida, además de automatizaciones e integraciones orientadas a objetivos reales de negocio.",
  },
  "home:en": {
    title: "Rodrigo Opalo | Websites, systems and automation",
    description:
      "I build custom websites, applications, and systems, plus automations and integrations aligned with real business goals.",
  },
  "portfolio:es": {
    title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
    description:
      "Explorá proyectos de sistemas, sitios web, e-commerce y estrategia de marca, con detalles de alcance, rol y tecnología.",
  },
  "portfolio:en": {
    title: "Portfolio: websites, systems and products | Rodrigo Opalo",
    description:
      "Explore systems, websites, e-commerce, and brand strategy projects with details on scope, role, and technology.",
  },
} as const;

const lockedLemBoxMetadata = {
  "lem-box:es": {
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    canonical: "https://www.devrodri.com/portfolio/lem-box",
  },
  "lem-box:en": {
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    canonical: "https://www.devrodri.com/en/portfolio/lem-box",
  },
} as const;

describe("public route registry", () => {
  it("contains exactly the approved six ES/EN routes", () => {
    expect(
      PUBLIC_ROUTES.map(
        ({
          routeKey,
          locale,
          pathname,
          equivalentLocalePath,
          page,
        }) => ({
          routeKey,
          locale,
          pathname,
          equivalentLocalePath,
          page,
        }),
      ),
    ).toEqual(expectedRoutes);
    expect(new Set(PUBLIC_ROUTES.map((route) => route.pathname)).size).toBe(6);
    expect(PUBLIC_ROUTES.map((route) => String(route.pathname))).not.toContain(
      "/es",
    );
  });

  it("keeps canonical, social, hreflang and sitemap metadata complete", () => {
    for (const route of PUBLIC_ROUTES) {
      expect(route.metadata.canonical).toBe(
        `${SITE_ORIGIN}${route.pathname}`,
      );
      expect(route.metadata.robots).toBe("index, follow");
      expect(route.metadata.title).not.toBe("");
      expect(route.metadata.description).not.toBe("");
      expect(route.metadata.og).not.toBeNull();
      expect(route.metadata.twitter).not.toBeNull();
      expect(route.metadata.og?.url).toBe(route.metadata.canonical);
      expect(route.metadata.og?.image).toMatchObject({
        width: 1200,
        height: 630,
      });
      expect(route.metadata.twitter?.card).toBe("summary_large_image");
      expect(route.metadata.hreflang.map(({ hrefLang }) => hrefLang)).toEqual([
        "es",
        "en",
        "x-default",
      ]);
      expect(route.metadata.hreflang[2]?.href).toBe(
        route.metadata.hreflang[0]?.href,
      );
      expect(route.sitemap.include).toBe(true);
    }
  });

  it("publishes the exact approved Home and Portfolio commercial metadata", () => {
    for (const [routeKey, expected] of Object.entries(
      expectedCommercialMetadata,
    )) {
      const route = PUBLIC_ROUTES.find(
        (candidate) => candidate.routeKey === routeKey,
      );

      expect(route).toBeDefined();
      expect(route?.metadata.title).toBe(expected.title);
      expect(route?.metadata.description).toBe(expected.description);
      expect(route?.metadata.og?.title).toBe(expected.title);
      expect(route?.metadata.og?.description).toBe(expected.description);
      expect(route?.metadata.twitter?.title).toBe(expected.title);
      expect(route?.metadata.twitter?.description).toBe(expected.description);
    }
  });

  it("keeps the locked LEM-BOX metadata and social image unchanged", () => {
    for (const [routeKey, expected] of Object.entries(lockedLemBoxMetadata)) {
      const route = PUBLIC_ROUTES.find(
        (candidate) => candidate.routeKey === routeKey,
      );

      expect(route).toBeDefined();
      expect(route?.metadata.title).toBe(expected.title);
      expect(route?.metadata.canonical).toBe(expected.canonical);
      expect(route?.metadata.og?.image).toEqual({
        alt: route?.locale === "es"
          ? "Portada de LEM-BOX"
          : "LEM-BOX cover",
        height: 630,
        url: "https://www.devrodri.com/img/lem-box-cover.png",
        width: 1200,
      });
    }
  });

  it("maps each page to its equivalent locale without regex routing", () => {
    expect(getLocalizedPath("home", "es")).toBe("/");
    expect(getLocalizedPath("home", "en")).toBe("/en");
    expect(getEquivalentLocalePath("/portfolio", "en")).toBe(
      "/en/portfolio",
    );
    expect(getEquivalentLocalePath("/en/portfolio", "es")).toBe(
      "/portfolio",
    );
    expect(getEquivalentLocalePath("/portfolio/lem-box", "en")).toBe(
      "/en/portfolio/lem-box",
    );
    expect(getEquivalentLocalePath("/en/portfolio/lem-box", "es")).toBe(
      "/portfolio/lem-box",
    );
  });

  it("normalizes only routing syntax and rejects unregistered paths", () => {
    expect(normalizePathname("/en/portfolio///?source=vis01#grid")).toBe(
      "/en/portfolio",
    );
    expect(getPublicRoute("/portfolio/?source=vis01#portfolio-grid")?.routeKey)
      .toBe("portfolio:es");
    expect(getPublicRoute("/en/portfolio/no-existe")).toBeNull();
    expect(getPublicRoute("/es")).toBeNull();
  });

  it("keeps NotFound closed to indexing and social metadata", () => {
    const metadata = getNotFoundMetadata();

    expect(metadata.robots).toBe("noindex, nofollow");
    expect(metadata.canonical).toBeNull();
    expect(metadata.hreflang).toEqual([]);
    expect(metadata.og).toBeNull();
    expect(metadata.twitter).toBeNull();
  });
});
