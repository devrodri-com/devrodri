import { describe, expect, it } from "vitest";
import {
  IBM_CREDENTIAL_ID,
  IBM_CREDLY_URL,
  LEM_BOX_CASE_STUDY_IDS,
  LEM_BOX_WEB_APPLICATION_ID,
  PERSON_DESCRIPTIONS,
  PERSON_ID,
  PERSON_JOB_TITLES,
  STRUCTURED_DATA_BY_ROUTE,
  WEBSITE_ID,
  getStructuredData,
} from "../seo/structuredData";

const forbiddenHomeProperties = [
  "issuer",
  "issuedBy",
  "dateIssued",
  "recognizedBy",
  "award",
  "address",
  "telephone",
  "worksFor",
  "alumniOf",
] as const;

const forbiddenLemBoxProperties = [
  "offers",
  "price",
  "review",
  "rating",
  "aggregateRating",
  "softwareVersion",
  "downloadUrl",
  "installUrl",
  "operatingSystem",
] as const;

function graphTypes(value: { "@graph": readonly { "@type": string }[] }) {
  return value["@graph"].map((node) => node["@type"]);
}

describe("route structured data", () => {
  it("defines every public route and leaves Portfolio without JSON-LD", () => {
    expect(Object.keys(STRUCTURED_DATA_BY_ROUTE)).toEqual([
      "home:es",
      "home:en",
      "portfolio:es",
      "portfolio:en",
      "lem-box:es",
      "lem-box:en",
    ]);
    expect(getStructuredData("portfolio:es")).toBeNull();
    expect(getStructuredData("portfolio:en")).toBeNull();
  });

  it.each(["es", "en"] as const)(
    "publishes one connected, prudent Home graph in %s",
    (locale) => {
      const graph = STRUCTURED_DATA_BY_ROUTE[`home:${locale}`];
      const [website, person, credential] = graph["@graph"];

      expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);
      expect(graph["@context"]).toBe("https://schema.org");
      expect(graphTypes(graph)).toEqual([
        "WebSite",
        "Person",
        "EducationalOccupationalCredential",
      ]);
      expect(website).toEqual({
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: "https://www.devrodri.com/",
        name: "devrodri",
        inLanguage: ["es", "en"],
        creator: { "@id": PERSON_ID },
      });
      expect(person).toEqual({
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Rodrigo Opalo",
        jobTitle: PERSON_JOB_TITLES[locale],
        description: PERSON_DESCRIPTIONS[locale],
        url: "https://www.devrodri.com/",
        image: "https://www.devrodri.com/img/sobremi.jpg",
        sameAs: [
          "https://github.com/devrodri-com",
          "https://www.linkedin.com/in/rodrigo-opalo-b56685390/",
        ],
        hasCredential: { "@id": IBM_CREDENTIAL_ID },
      });
      expect(person.jobTitle).toBe(
        locale === "es"
          ? "Integrador de tecnología con mentalidad de producto"
          : "Technology integrator with a product mindset",
      );
      expect(person.description).toBe(
        locale === "es"
          ? "Creo sitios, aplicaciones y sistemas a medida combinando estrategia, experiencia de usuario y tecnología. También implemento automatizaciones, integraciones y asistentes con IA para conectar herramientas, optimizar procesos y reducir trabajo manual."
          : "I create custom websites, applications, and systems by combining strategy, user experience, and technology. I also implement automations, integrations, and AI assistants to connect tools, optimize processes, and reduce manual work.",
      );
      expect(credential).toMatchObject({
        "@type": "EducationalOccupationalCredential",
        "@id": IBM_CREDENTIAL_ID,
        name: "IBM Full Stack Software Developer Professional Certificate (V5)",
        credentialCategory: "Professional Certificate",
        url: IBM_CREDLY_URL,
      });
      expect(credential.description).toBe(
        locale === "es"
          ? "Certificación profesional verificada por IBM Skills Network y Credly."
          : "Professional certification verified by IBM Skills Network and Credly.",
      );

      const source = JSON.stringify(graph);
      expect(source).not.toContain("Meta React");
      expect(source).not.toContain("https://www.ibm.com/skills-network");
      for (const property of forbiddenHomeProperties) {
        expect(source).not.toContain(`"${property}"`);
      }
    },
  );

  it.each(["es", "en"] as const)(
    "publishes one localized, connected LEM-BOX graph in %s",
    (locale) => {
      const graph = STRUCTURED_DATA_BY_ROUTE[`lem-box:${locale}`];
      const [creativeWork, webApplication] = graph["@graph"];
      const canonicalPath =
        locale === "es" ? "/portfolio/lem-box" : "/en/portfolio/lem-box";

      expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);
      expect(graph["@context"]).toBe("https://schema.org");
      expect(graphTypes(graph)).toEqual(["CreativeWork", "WebApplication"]);
      expect(creativeWork).toMatchObject({
        "@id": LEM_BOX_CASE_STUDY_IDS[locale],
        url: `https://www.devrodri.com${canonicalPath}`,
        image: "https://www.devrodri.com/img/lem-box-cover.png",
        inLanguage: locale,
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": LEM_BOX_WEB_APPLICATION_ID },
      });
      expect(webApplication).toMatchObject({
        "@id": LEM_BOX_WEB_APPLICATION_ID,
        name: "LEM-BOX",
        url: "https://lem-box.com",
        applicationCategory: "BusinessApplication",
        creator: { "@id": PERSON_ID },
      });
      expect(creativeWork.name).toBe(
        locale === "es"
          ? "LEM-BOX: plataforma logística y producto propio"
          : "LEM-BOX: logistics platform and own product",
      );
      expect(creativeWork.description).not.toBe("");
      expect(webApplication.description).not.toBe("");

      const source = JSON.stringify(graph);
      for (const property of forbiddenLemBoxProperties) {
        expect(source).not.toContain(`"${property}"`);
      }
      expect(source).not.toContain("SoftwareApplication");
      expect(source).not.toContain("Android");
      expect(source).not.toContain("iOS");
    },
  );
});
