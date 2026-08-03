import translations from "../i18n";
import { lemBoxCase } from "../data/portfolio/cases/lemBox";
import type { Language } from "../i18n/language";

export const SITE_ORIGIN = "https://www.devrodri.com";

export type IndexablePageKey = "home" | "portfolio" | "lem-box";
export type ThankYouPageKey = "thank-you";
export type PageKey = IndexablePageKey | ThankYouPageKey;
export type PublicRouteKey = `${IndexablePageKey}:${Language}`;
export type ThankYouRouteKey = `${ThankYouPageKey}:${Language}`;
export type IndexablePublicPathname =
  | "/"
  | "/portfolio"
  | "/portfolio/lem-box"
  | "/en"
  | "/en/portfolio"
  | "/en/portfolio/lem-box";
export type ThankYouPathname = "/gracias" | "/en/thank-you";
export type PublicPathname = IndexablePublicPathname | ThankYouPathname;

type Hreflang = {
  href: string;
  hrefLang: Language | "x-default";
};

type SocialImage = {
  alt: string;
  height: number;
  url: string;
  width: number;
};

export type RouteMetadata = {
  canonical: string | null;
  description: string;
  hreflang: readonly Hreflang[];
  og: {
    description: string;
    image: SocialImage;
    title: string;
    type: "article" | "website";
    url: string;
  } | null;
  robots: "index, follow" | "noindex, nofollow";
  title: string;
  twitter: {
    card: "summary_large_image";
    description: string;
    image: SocialImage;
    title: string;
  } | null;
};

type PublicRouteBase = {
  equivalentLocalePath: PublicPathname;
  locale: Language;
  metadata: RouteMetadata;
  pathname: PublicPathname;
};

export type IndexablePublicRoute = PublicRouteBase & {
  page: IndexablePageKey;
  routeKey: PublicRouteKey;
  sitemap: {
    include: true;
  };
};

export type ThankYouPublicRoute = PublicRouteBase & {
  page: ThankYouPageKey;
  routeKey: ThankYouRouteKey;
  sitemap: {
    include: false;
  };
};

export type PublicRoute = IndexablePublicRoute | ThankYouPublicRoute;

type RouteDefinition = {
  localePath: Record<Language, IndexablePublicPathname>;
  metadata: Record<
    Language,
    {
      description: string;
      ogImageAlt: string;
      ogImagePath: string;
      ogType: "article" | "website";
      title: string;
    }
  >;
  page: IndexablePageKey;
};

const routeDefinitions = [
  {
    page: "home",
    localePath: { es: "/", en: "/en" },
    metadata: {
      es: {
        title: translations.es.seo.title,
        description: translations.es.seo.description,
        ogImagePath: "/img/social-preview.png",
        ogImageAlt: "Vista previa de devrodri",
        ogType: "website",
      },
      en: {
        title: translations.en.seo.title,
        description: translations.en.seo.description,
        ogImagePath: "/img/social-preview.png",
        ogImageAlt: "devrodri social preview",
        ogType: "website",
      },
    },
  },
  {
    page: "portfolio",
    localePath: { es: "/portfolio", en: "/en/portfolio" },
    metadata: {
      es: {
        title: translations.es.portfolio.seo.title,
        description: translations.es.portfolio.seo.description,
        ogImagePath: "/img/social-preview.png",
        ogImageAlt: "Vista previa del portfolio de Rodrigo Opalo",
        ogType: "website",
      },
      en: {
        title: translations.en.portfolio.seo.title,
        description: translations.en.portfolio.seo.description,
        ogImagePath: "/img/social-preview.png",
        ogImageAlt: "Rodrigo Opalo portfolio preview",
        ogType: "website",
      },
    },
  },
  {
    page: "lem-box",
    localePath: {
      es: "/portfolio/lem-box",
      en: "/en/portfolio/lem-box",
    },
    metadata: {
      es: {
        title: lemBoxCase.caseStudy.content.es.seo.title,
        description: lemBoxCase.caseStudy.content.es.seo.description,
        ogImagePath: lemBoxCase.cover,
        ogImageAlt: lemBoxCase.caseStudy.content.es.header.coverAlt,
        ogType: "article",
      },
      en: {
        title: lemBoxCase.caseStudy.content.en.seo.title,
        description: lemBoxCase.caseStudy.content.en.seo.description,
        ogImagePath: lemBoxCase.cover,
        ogImageAlt: lemBoxCase.caseStudy.content.en.header.coverAlt,
        ogType: "article",
      },
    },
  },
] as const satisfies readonly RouteDefinition[];

function absoluteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname}`;
}

function createRoute(
  definition: RouteDefinition,
  locale: Language,
): IndexablePublicRoute {
  const pathname = definition.localePath[locale];
  const alternateLocale: Language = locale === "es" ? "en" : "es";
  const equivalentLocalePath = definition.localePath[alternateLocale];
  const values = definition.metadata[locale];
  const image: SocialImage = {
    alt: values.ogImageAlt,
    height: 630,
    url: absoluteUrl(values.ogImagePath),
    width: 1200,
  };

  return {
    routeKey: `${definition.page}:${locale}`,
    locale,
    pathname,
    equivalentLocalePath,
    page: definition.page,
    metadata: {
      canonical: absoluteUrl(pathname),
      description: values.description,
      hreflang: [
        {
          hrefLang: "es",
          href: absoluteUrl(definition.localePath.es),
        },
        {
          hrefLang: "en",
          href: absoluteUrl(definition.localePath.en),
        },
        {
          hrefLang: "x-default",
          href: absoluteUrl(definition.localePath.es),
        },
      ],
      og: {
        description: values.description,
        image,
        title: values.title,
        type: values.ogType,
        url: absoluteUrl(pathname),
      },
      robots: "index, follow",
      title: values.title,
      twitter: {
        card: "summary_large_image",
        description: values.description,
        image,
        title: values.title,
      },
    },
    sitemap: { include: true },
  };
}

const indexableRoutes: readonly IndexablePublicRoute[] = routeDefinitions.flatMap(
  (definition) => [
    createRoute(definition, "es"),
    createRoute(definition, "en"),
  ],
);

const thankYouRoutes = [
  {
    equivalentLocalePath: "/en/thank-you",
    locale: "es",
    metadata: {
      canonical: null,
      description:
        "Gracias por escribirme. Recibí tu consulta y te voy a responder lo antes posible.",
      hreflang: [],
      og: null,
      robots: "noindex, nofollow",
      title: "Consulta enviada | Rodrigo Opalo",
      twitter: null,
    },
    page: "thank-you",
    pathname: "/gracias",
    routeKey: "thank-you:es",
    sitemap: { include: false },
  },
  {
    equivalentLocalePath: "/gracias",
    locale: "en",
    metadata: {
      canonical: null,
      description:
        "Thanks for getting in touch. I received your inquiry and will get back to you as soon as possible.",
      hreflang: [],
      og: null,
      robots: "noindex, nofollow",
      title: "Inquiry sent | Rodrigo Opalo",
      twitter: null,
    },
    page: "thank-you",
    pathname: "/en/thank-you",
    routeKey: "thank-you:en",
    sitemap: { include: false },
  },
] as const satisfies readonly ThankYouPublicRoute[];

export const PUBLIC_ROUTES: readonly PublicRoute[] = [
  ...indexableRoutes,
  ...thankYouRoutes,
];

export function isIndexablePublicRoute(
  route: PublicRoute,
): route is IndexablePublicRoute {
  return route.sitemap.include;
}

function stripQueryAndHash(value: string): string {
  const queryIndex = value.indexOf("?");
  const hashIndex = value.indexOf("#");
  const endCandidates = [queryIndex, hashIndex].filter((index) => index >= 0);
  const end = endCandidates.length === 0 ? value.length : Math.min(...endCandidates);
  return value.slice(0, end);
}

export function normalizePathname(value: string): string {
  let pathname = stripQueryAndHash(value);
  while (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname === "" ? "/" : pathname;
}

export function getPublicRoute(pathname: string): PublicRoute | null {
  const normalizedPathname = normalizePathname(pathname);
  return (
    PUBLIC_ROUTES.find((route) => route.pathname === normalizedPathname) ?? null
  );
}

export function getLocalizedPath(
  page: PageKey,
  locale: Language,
): PublicPathname {
  const route = PUBLIC_ROUTES.find(
    (candidate) => candidate.page === page && candidate.locale === locale,
  );
  if (route === undefined) {
    throw new Error(`Missing ${locale} route for page "${page}"`);
  }
  return route.pathname;
}

export function getLocaleForPathname(pathname: string): Language {
  const normalizedPathname = normalizePathname(pathname);
  const publicLocale = getPublicRoute(normalizedPathname)?.locale;
  if (publicLocale !== undefined) return publicLocale;

  return normalizedPathname === "/en" || normalizedPathname.startsWith("/en/")
    ? "en"
    : "es";
}

export function getEquivalentLocalePath(
  pathname: string,
  locale: Language,
): PublicPathname {
  const currentRoute = getPublicRoute(pathname);
  if (currentRoute === null) return getLocalizedPath("home", locale);
  return getLocalizedPath(currentRoute.page, locale);
}

export function getNotFoundMetadata(locale: Language): RouteMetadata {
  const localized = locale === "es"
    ? {
        description: "La página solicitada no está disponible.",
        title: "Página no encontrada | devrodri",
      }
    : {
        description: "The requested page isn't available.",
        title: "Page not found | devrodri",
      };

  return {
    canonical: null,
    description: localized.description,
    hreflang: [],
    og: null,
    robots: "noindex, nofollow",
    title: localized.title,
    twitter: null,
  };
}

export function getMetadataForPathname(pathname: string): RouteMetadata {
  return (
    getPublicRoute(pathname)?.metadata ??
    getNotFoundMetadata(getLocaleForPathname(pathname))
  );
}
