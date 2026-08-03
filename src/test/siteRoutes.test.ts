import { describe, expect, it } from "vitest";
import {
  PUBLIC_ROUTES,
  SITE_ORIGIN,
  getEquivalentLocalePath,
  getLocaleForPathname,
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
  {
    routeKey: "thank-you:es",
    locale: "es",
    pathname: "/gracias",
    equivalentLocalePath: "/en/thank-you",
    page: "thank-you",
  },
  {
    routeKey: "thank-you:en",
    locale: "en",
    pathname: "/en/thank-you",
    equivalentLocalePath: "/gracias",
    page: "thank-you",
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
  it("contains the six indexable routes and two localized confirmation routes", () => {
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
    expect(new Set(PUBLIC_ROUTES.map((route) => route.pathname)).size).toBe(8);
    expect(new Set(PUBLIC_ROUTES.map((route) => route.routeKey)).size).toBe(8);
    expect(PUBLIC_ROUTES.filter((route) => route.sitemap.include)).toHaveLength(
      6,
    );
    expect(PUBLIC_ROUTES.filter((route) => !route.sitemap.include)).toHaveLength(
      2,
    );
    expect(PUBLIC_ROUTES.map((route) => String(route.pathname))).not.toContain(
      "/es",
    );
  });

  it("keeps canonical, social, hreflang and sitemap metadata complete", () => {
    for (const route of PUBLIC_ROUTES.filter(
      (candidate) => candidate.sitemap.include,
    )) {
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

  it("keeps confirmation route identities unique and all discovery metadata absent", () => {
    const thankYouRoutes = PUBLIC_ROUTES.filter(
      (route) => !route.sitemap.include,
    );

    expect(thankYouRoutes.map((route) => route.routeKey)).toEqual([
      "thank-you:es",
      "thank-you:en",
    ]);
    expect(
      thankYouRoutes.some((route) => route.routeKey.startsWith("portfolio:")),
    ).toBe(false);

    for (const route of thankYouRoutes) {
      expect(route.page).toBe("thank-you");
      expect(route.sitemap.include).toBe(false);
      expect(route.metadata.robots).toBe("noindex, nofollow");
      expect(route.metadata.canonical).toBeNull();
      expect(route.metadata.hreflang).toEqual([]);
      expect(route.metadata.og).toBeNull();
      expect(route.metadata.twitter).toBeNull();
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
    expect(getLocalizedPath("thank-you", "es")).toBe("/gracias");
    expect(getLocalizedPath("thank-you", "en")).toBe("/en/thank-you");
    expect(getEquivalentLocalePath("/gracias", "en")).toBe(
      "/en/thank-you",
    );
    expect(getEquivalentLocalePath("/en/thank-you", "es")).toBe(
      "/gracias",
    );
  });

  it("normalizes only routing syntax and rejects unregistered paths", () => {
    expect(normalizePathname("/en/portfolio///?source=vis01#grid")).toBe(
      "/en/portfolio",
    );
    expect(getPublicRoute("/portfolio/?source=vis01#portfolio-grid")?.routeKey)
      .toBe("portfolio:es");
    expect(getPublicRoute("/gracias/?source=form#main-content")?.routeKey)
      .toBe("thank-you:es");
    expect(getPublicRoute("/en/thank-you/")?.routeKey).toBe("thank-you:en");
    expect(getPublicRoute("/en/portfolio/no-existe")).toBeNull();
    expect(getPublicRoute("/es")).toBeNull();
  });

  it("derives an unknown route locale from the exact lowercase /en prefix", () => {
    expect(getLocaleForPathname("/en/no-existe")).toBe("en");
    expect(getLocaleForPathname("/en/portfolio/no-existe")).toBe("en");
    expect(getLocaleForPathname("/en/private?source=test#details")).toBe("en");
    expect(getLocaleForPathname("/no-existe")).toBe("es");
    expect(getLocaleForPathname("/portfolio/no-existe")).toBe("es");
    expect(getLocaleForPathname("/EN/no-existe")).toBe("es");
  });

  it.each([
    {
      description: "La página solicitada no está disponible.",
      locale: "es",
      title: "Página no encontrada | devrodri",
    },
    {
      description: "The requested page isn't available.",
      locale: "en",
      title: "Page not found | devrodri",
    },
  ] as const)(
    "keeps the $locale NotFound metadata localized and closed to indexing",
    ({ description, locale, title }) => {
      const metadata = getNotFoundMetadata(locale);

      expect(metadata.title).toBe(title);
      expect(metadata.description).toBe(description);
      expect(metadata.robots).toBe("noindex, nofollow");
      expect(metadata.canonical).toBeNull();
      expect(metadata.hreflang).toEqual([]);
      expect(metadata.og).toBeNull();
      expect(metadata.twitter).toBeNull();
    },
  );
});
