import type { FilledContext } from "react-helmet-async";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PERSON_DESCRIPTIONS,
  PERSON_ID,
  PERSON_JOB_TITLES,
} from "../seo/structuredData";

type JsonLdNode = { "@type": string; "@id"?: string } & Record<
  string,
  unknown
>;
type JsonLdGraph = { "@graph": JsonLdNode[] };

const routes = [
  { hasJsonLd: true, locale: "es" as const, pathname: "/" },
  { hasJsonLd: true, locale: "en" as const, pathname: "/en" },
  { hasJsonLd: false, locale: "es" as const, pathname: "/servicios" },
  { hasJsonLd: false, locale: "en" as const, pathname: "/en/services" },
  {
    hasJsonLd: false,
    locale: "es" as const,
    pathname: "/servicios/sitios-web-para-empresas",
  },
  {
    hasJsonLd: false,
    locale: "en" as const,
    pathname: "/en/services/business-websites",
  },
  {
    hasJsonLd: false,
    locale: "es" as const,
    pathname: "/servicios/sistemas-a-medida",
  },
  {
    hasJsonLd: false,
    locale: "en" as const,
    pathname: "/en/services/custom-software",
  },
];

function jsonLdScripts() {
  return document.head.querySelectorAll(
    'script[type="application/ld+json"]',
  );
}

function personNode(script: Element | undefined): JsonLdNode {
  const graph = JSON.parse(script?.textContent ?? "null") as JsonLdGraph;
  const personNodes = graph["@graph"].filter(
    (node) => node["@type"] === "Person",
  );
  expect(personNodes).toHaveLength(1);
  const [person] = personNodes;
  if (person === undefined) {
    throw new Error("Missing Person node");
  }
  return person;
}

// react-helmet-async decides once, at module load, whether it can use the
// DOM directly. jsdom always provides `document`, so a normal import would
// make it behave like a client instead of populating helmetContext. Hiding
// the DOM globals and forcing a fresh module load reproduces the real
// server-render code path, matching scripts/prerender.mjs in production.
async function renderPrerenderedHead(pathname: string) {
  vi.stubGlobal("document", undefined);
  vi.stubGlobal("window", undefined);
  vi.resetModules();

  try {
    const [{ createServerApplication }, { renderToString }] =
      await Promise.all([
        import("../entry-server"),
        import("react-dom/server"),
      ]);
    const helmetContext: Partial<FilledContext> = {};
    const appHtml = renderToString(
      createServerApplication(pathname, helmetContext),
    );
    const { helmet } = helmetContext;
    if (helmet === undefined) {
      throw new Error("Helmet did not produce server metadata");
    }

    return {
      appHtml,
      head: [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join("\n"),
    };
  } finally {
    vi.unstubAllGlobals();
    vi.resetModules();
  }
}

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

describe("prerendered head hydration", () => {
  it.each(routes)(
    "hydrates $pathname without duplicating the head or the Person node",
    async ({ hasJsonLd, locale, pathname }) => {
      const { appHtml, head } = await renderPrerenderedHead(pathname);

      document.head.innerHTML = head;
      document.body.innerHTML = `<div id="root">${appHtml}</div>`;

      const prerenderedScripts = jsonLdScripts();
      expect(prerenderedScripts).toHaveLength(hasJsonLd ? 1 : 0);
      if (hasJsonLd) {
        expect(prerenderedScripts[0]).toHaveAttribute("data-rh", "true");
        const prerenderedPerson = personNode(prerenderedScripts[0]);
        expect(prerenderedPerson["@id"]).toBe(PERSON_ID);
        expect(prerenderedPerson.description).toBe(PERSON_DESCRIPTIONS[locale]);
        expect(prerenderedPerson.jobTitle).toBe(PERSON_JOB_TITLES[locale]);
      }

      const container = document.getElementById("root");
      if (container === null) {
        throw new Error("Missing prerendered #root");
      }

      // Fresh imports here (post-restore) pair a live 'react'/'react-dom'
      // instance with react-helmet-async in its real client (canUseDOM)
      // mode, matching what main.tsx does in production.
      const [
        { act, waitFor },
        { hydrateRoot },
        { MemoryRouter },
        { RoutedLanguageProvider },
        { default: App },
      ] = await Promise.all([
        import("@testing-library/react"),
        import("react-dom/client"),
        import("react-router-dom"),
        import("../i18n/LanguageProvider"),
        import("../App"),
      ]);

      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      let root: import("react-dom/client").Root | undefined;

      try {
        await act(async () => {
          root = hydrateRoot(
            container,
            <MemoryRouter initialEntries={[pathname]}>
              <RoutedLanguageProvider>
                <App />
              </RoutedLanguageProvider>
            </MemoryRouter>,
          );
        });

        await waitFor(() => {
          expect(jsonLdScripts()).toHaveLength(hasJsonLd ? 1 : 0);
        });

        expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(
          /hydration|did not match|server html/i,
        );

        expect(document.head.querySelectorAll("title")).toHaveLength(1);
        expect(
          document.head.querySelectorAll('meta[name="description"]'),
        ).toHaveLength(1);
        expect(
          document.head.querySelectorAll('link[rel="canonical"]'),
        ).toHaveLength(1);
        expect(
          document.head.querySelectorAll('link[rel="alternate"]'),
        ).toHaveLength(3);

        const hydratedScripts = jsonLdScripts();
        expect(hydratedScripts).toHaveLength(hasJsonLd ? 1 : 0);
        if (hasJsonLd) {
          const hydratedPerson = personNode(hydratedScripts[0]);
          expect(hydratedPerson["@id"]).toBe(PERSON_ID);
          expect(hydratedPerson.description).toBe(PERSON_DESCRIPTIONS[locale]);
          expect(hydratedPerson.jobTitle).toBe(PERSON_JOB_TITLES[locale]);
        }
      } finally {
        consoleError.mockRestore();
        await act(async () => {
          root?.unmount();
        });
      }
    },
  );
});
