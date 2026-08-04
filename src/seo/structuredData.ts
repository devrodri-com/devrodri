import { lemBoxCase } from "../data/portfolio/cases/lemBox";
import type { Language } from "../i18n/language";
import type { PublicRouteKey } from "../routes/siteRoutes";

const SCHEMA_CONTEXT = "https://schema.org";
const SITE_URL = "https://www.devrodri.com/";

export const WEBSITE_ID = "https://www.devrodri.com/#website";
export const PERSON_ID = "https://www.devrodri.com/#person";
export const IBM_CREDENTIAL_ID =
  "https://www.devrodri.com/#ibm-full-stack-credential";
export const LEM_BOX_WEB_APPLICATION_ID =
  "https://www.devrodri.com/#lem-box-web-application";
export const LEM_BOX_CASE_STUDY_IDS = {
  es: "https://www.devrodri.com/portfolio/lem-box#case-study",
  en: "https://www.devrodri.com/en/portfolio/lem-box#case-study",
} as const satisfies Record<Language, string>;
export const IBM_CREDLY_URL =
  "https://www.credly.com/badges/26e359b2-526b-4f12-85b4-34a51759be15/linked_in_profile";

type Reference = {
  "@id": string;
};

type WebSiteNode = {
  "@type": "WebSite";
  "@id": typeof WEBSITE_ID;
  url: typeof SITE_URL;
  name: "devrodri";
  inLanguage: readonly ["es", "en"];
  creator: Reference;
};

type PersonNode = {
  "@type": "Person";
  "@id": typeof PERSON_ID;
  name: "Rodrigo Opalo";
  jobTitle: string;
  description: string;
  url: typeof SITE_URL;
  image: "https://www.devrodri.com/img/sobremi.jpg";
  sameAs: readonly [
    "https://github.com/devrodri-com",
    "https://www.linkedin.com/in/rodrigo-opalo-b56685390/",
  ];
  hasCredential: Reference;
};

type CredentialNode = {
  "@type": "EducationalOccupationalCredential";
  "@id": typeof IBM_CREDENTIAL_ID;
  name: "IBM Full Stack Software Developer Professional Certificate (V5)";
  credentialCategory: "Professional Certificate";
  url: typeof IBM_CREDLY_URL;
  description: string;
};

type CreativeWorkNode = {
  "@type": "CreativeWork";
  "@id": string;
  name: string;
  description: string;
  url: string;
  image: "https://www.devrodri.com/img/lem-box-cover.png";
  inLanguage: Language;
  author: Reference;
  isPartOf: Reference;
  about: Reference;
};

type WebApplicationNode = {
  "@type": "WebApplication";
  "@id": typeof LEM_BOX_WEB_APPLICATION_ID;
  name: "LEM-BOX";
  url: "https://lem-box.com";
  description: string;
  applicationCategory: "BusinessApplication";
  creator: Reference;
};

export type HomeStructuredData = {
  "@context": typeof SCHEMA_CONTEXT;
  "@graph": readonly [WebSiteNode, PersonNode, CredentialNode];
};

export type LemBoxStructuredData = {
  "@context": typeof SCHEMA_CONTEXT;
  "@graph": readonly [CreativeWorkNode, WebApplicationNode];
};

export type StructuredData = HomeStructuredData | LemBoxStructuredData;

const credentialDescriptions = {
  es: "Certificación profesional verificada por IBM Skills Network y Credly.",
  en: "Professional certification verified by IBM Skills Network and Credly.",
} as const satisfies Record<Language, string>;

// Mirrors the visible About-section copy in SobreMiSection.tsx verbatim.
export const PERSON_JOB_TITLES = {
  es: "Integrador de tecnología con mentalidad de producto",
  en: "Technology integrator with a product mindset",
} as const satisfies Record<Language, string>;

// Mirrors the visible About-section copy in SobreMiSection.tsx verbatim.
export const PERSON_DESCRIPTIONS = {
  es: "Creo sitios, aplicaciones y sistemas a medida combinando estrategia, experiencia de usuario y tecnología. También implemento automatizaciones, integraciones y asistentes con IA para conectar herramientas, optimizar procesos y reducir trabajo manual.",
  en: "I create custom websites, applications, and systems by combining strategy, user experience, and technology. I also implement automations, integrations, and AI assistants to connect tools, optimize processes, and reduce manual work.",
} as const satisfies Record<Language, string>;

function reference(id: string): Reference {
  return { "@id": id };
}

function createHomeStructuredData(locale: Language): HomeStructuredData {
  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "devrodri",
        inLanguage: ["es", "en"],
        creator: reference(PERSON_ID),
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Rodrigo Opalo",
        jobTitle: PERSON_JOB_TITLES[locale],
        description: PERSON_DESCRIPTIONS[locale],
        url: SITE_URL,
        image: "https://www.devrodri.com/img/sobremi.jpg",
        sameAs: [
          "https://github.com/devrodri-com",
          "https://www.linkedin.com/in/rodrigo-opalo-b56685390/",
        ],
        hasCredential: reference(IBM_CREDENTIAL_ID),
      },
      {
        "@type": "EducationalOccupationalCredential",
        "@id": IBM_CREDENTIAL_ID,
        name: "IBM Full Stack Software Developer Professional Certificate (V5)",
        credentialCategory: "Professional Certificate",
        url: IBM_CREDLY_URL,
        description: credentialDescriptions[locale],
      },
    ],
  };
}

function createLemBoxStructuredData(locale: Language): LemBoxStructuredData {
  const content = lemBoxCase.caseStudy.content[locale];
  const pathname =
    locale === "es" ? "/portfolio/lem-box" : "/en/portfolio/lem-box";

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": LEM_BOX_CASE_STUDY_IDS[locale],
        name: content.seo.title.replace(" | Rodrigo Opalo", ""),
        description: content.summary.text,
        url: `https://www.devrodri.com${pathname}`,
        image: "https://www.devrodri.com/img/lem-box-cover.png",
        inLanguage: locale,
        author: reference(PERSON_ID),
        isPartOf: reference(WEBSITE_ID),
        about: reference(LEM_BOX_WEB_APPLICATION_ID),
      },
      {
        "@type": "WebApplication",
        "@id": LEM_BOX_WEB_APPLICATION_ID,
        name: "LEM-BOX",
        url: "https://lem-box.com",
        description: content.solution.text,
        applicationCategory: "BusinessApplication",
        creator: reference(PERSON_ID),
      },
    ],
  };
}

export const STRUCTURED_DATA_BY_ROUTE = {
  "home:es": createHomeStructuredData("es"),
  "home:en": createHomeStructuredData("en"),
  "portfolio:es": null,
  "portfolio:en": null,
  "lem-box:es": createLemBoxStructuredData("es"),
  "lem-box:en": createLemBoxStructuredData("en"),
} as const satisfies Record<PublicRouteKey, StructuredData | null>;

export function getStructuredData(
  routeKey: PublicRouteKey,
): StructuredData | null {
  return STRUCTURED_DATA_BY_ROUTE[routeKey];
}
