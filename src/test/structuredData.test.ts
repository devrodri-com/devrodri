import { describe, expect, it } from "vitest";
import {
  BRAND_ID,
  BRAND_LOGO_ID,
  BRAND_LOGO_URL,
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

const forbiddenSchemaTypes = [
  "Organization",
  "ProfessionalService",
  "LocalBusiness",
  "ProfilePage",
] as const;

function graphTypes(value: { "@graph": readonly { "@type": string }[] }) {
  return value["@graph"].map((node) => node["@type"]);
}

describe("route structured data", () => {
  it("defines every public route and leaves Portfolio and services without JSON-LD", () => {
    expect(Object.keys(STRUCTURED_DATA_BY_ROUTE)).toEqual([
      "home:es",
      "home:en",
      "portfolio:es",
      "portfolio:en",
      "lem-box:es",
      "lem-box:en",
      "services:es",
      "services:en",
      "business-websites:es",
      "business-websites:en",
      "custom-software:es",
      "custom-software:en",
    ]);
    expect(getStructuredData("portfolio:es")).toBeNull();
    expect(getStructuredData("portfolio:en")).toBeNull();
    expect(getStructuredData("services:es")).toBeNull();
    expect(getStructuredData("services:en")).toBeNull();
    expect(getStructuredData("business-websites:es")).toBeNull();
    expect(getStructuredData("business-websites:en")).toBeNull();
    expect(getStructuredData("custom-software:es")).toBeNull();
    expect(getStructuredData("custom-software:en")).toBeNull();
  });

  it.each(["es", "en"] as const)(
    "publishes one connected, prudent Home graph in %s",
    (locale) => {
      const graph = STRUCTURED_DATA_BY_ROUTE[`home:${locale}`];
      const [website, person, credential, brand, brandLogo] = graph["@graph"];

      expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);
      expect(graph["@context"]).toBe("https://schema.org");
      expect(graphTypes(graph)).toEqual([
        "WebSite",
        "Person",
        "EducationalOccupationalCredential",
        "Brand",
        "ImageObject",
      ]);
      expect(website).toEqual({
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: "https://www.devrodri.com/",
        name: "devrodri",
        inLanguage: ["es", "en"],
        creator: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": BRAND_ID },
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
        brand: { "@id": BRAND_ID },
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
      expect(credential).toEqual({
        "@type": "EducationalOccupationalCredential",
        "@id": IBM_CREDENTIAL_ID,
        name: "IBM Full Stack Software Developer Professional Certificate (V5)",
        credentialCategory: "Professional Certificate",
        url: IBM_CREDLY_URL,
        description:
          locale === "es"
            ? "Certificación profesional verificada por IBM Skills Network y Credly."
            : "Professional certification verified by IBM Skills Network and Credly.",
      });
      expect(credential.description).toBe(
        locale === "es"
          ? "Certificación profesional verificada por IBM Skills Network y Credly."
          : "Professional certification verified by IBM Skills Network and Credly.",
      );
      expect(brand).toEqual({
        "@type": "Brand",
        "@id": BRAND_ID,
        name: "devrodri",
        url: "https://www.devrodri.com/",
        owner: { "@id": PERSON_ID },
        logo: { "@id": BRAND_LOGO_ID },
      });
      expect(brandLogo).toEqual({
        "@type": "ImageObject",
        "@id": BRAND_LOGO_ID,
        contentUrl: BRAND_LOGO_URL,
        encodingFormat: "image/svg+xml",
      });

      for (const type of ["WebSite", "Person", "Brand", "ImageObject"]) {
        expect(graph["@graph"].filter((node) => node["@type"] === type))
          .toHaveLength(1);
      }

      const source = JSON.stringify(graph);
      expect(source).not.toContain("Meta React");
      expect(source).not.toContain("https://www.ibm.com/skills-network");
      for (const property of forbiddenHomeProperties) {
        expect(source).not.toContain(`"${property}"`);
      }
      for (const type of forbiddenSchemaTypes) {
        expect(source).not.toContain(`"@type":"${type}"`);
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
      for (const type of forbiddenSchemaTypes) {
        expect(source).not.toContain(`"@type":"${type}"`);
      }
    },
  );

  it("keeps the ES and EN LEM-BOX graphs serialized exactly", () => {
    expect(JSON.stringify(STRUCTURED_DATA_BY_ROUTE["lem-box:es"])).toBe(
      '{"@context":"https://schema.org","@graph":[{"@type":"CreativeWork","@id":"https://www.devrodri.com/portfolio/lem-box#case-study","name":"LEM-BOX: plataforma logística y producto propio","description":"LEM-BOX es un negocio logístico con más de 10 años de trayectoria. Su ecosistema digital actual forma parte de una evolución más reciente y conecta los sitios comerciales de Uruguay y Argentina con una plataforma central utilizada por clientes, partners y el equipo operativo.","url":"https://www.devrodri.com/portfolio/lem-box","image":"https://www.devrodri.com/img/lem-box-cover.png","inLanguage":"es","author":{"@id":"https://www.devrodri.com/#person"},"isPartOf":{"@id":"https://www.devrodri.com/#website"},"about":{"@id":"https://www.devrodri.com/#lem-box-web-application"}},{"@type":"WebApplication","@id":"https://www.devrodri.com/#lem-box-web-application","name":"LEM-BOX","url":"https://lem-box.com","description":"Diseñé y desarrollé una plataforma central conectada con las superficies comerciales de cada mercado. El resultado es un ecosistema donde la información acompaña el recorrido desde la captación hasta la operación y el seguimiento.","applicationCategory":"BusinessApplication","creator":{"@id":"https://www.devrodri.com/#person"}}]}',
    );
    expect(JSON.stringify(STRUCTURED_DATA_BY_ROUTE["lem-box:en"])).toBe(
      '{"@context":"https://schema.org","@graph":[{"@type":"CreativeWork","@id":"https://www.devrodri.com/en/portfolio/lem-box#case-study","name":"LEM-BOX: logistics platform and own product","description":"LEM-BOX is a logistics business with more than 10 years of experience. Its current digital ecosystem is part of a more recent evolution and connects the commercial websites for Uruguay and Argentina with a central platform used by customers, partners, and the operations team.","url":"https://www.devrodri.com/en/portfolio/lem-box","image":"https://www.devrodri.com/img/lem-box-cover.png","inLanguage":"en","author":{"@id":"https://www.devrodri.com/#person"},"isPartOf":{"@id":"https://www.devrodri.com/#website"},"about":{"@id":"https://www.devrodri.com/#lem-box-web-application"}},{"@type":"WebApplication","@id":"https://www.devrodri.com/#lem-box-web-application","name":"LEM-BOX","url":"https://lem-box.com","description":"I designed and developed a central platform connected to the commercial surfaces of each market. The result is an ecosystem where information follows the journey from acquisition through operations and tracking.","applicationCategory":"BusinessApplication","creator":{"@id":"https://www.devrodri.com/#person"}}]}',
    );
  });
});
