import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";
import translations from "../i18n";

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

const approvedCoverageEs =
  "Trabajo desde el sur de Florida con empresas de Miami y del resto de Estados Unidos, y también de forma remota con clientes de Latinoamérica. La comunicación puede ser en español o en inglés durante todo el proyecto.";
const approvedProjectNoteEs =
  "Cada proyecto tuvo un alcance distinto. En el portfolio podés ver el rol y las tecnologías utilizadas en cada uno.";
const approvedProjectNoteEn =
  "Each project had a different scope. In the portfolio, you can see the role and technologies used in each one.";

function renderApp(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <RoutedLanguageProvider>
        <App />
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

describe("VIS-SVC-01 service page polish contracts", () => {
  it.each([
    {
      heading: "Sitios web, sistemas y automatización para empresas.",
      hrefs: [
        "/servicios/sitios-web-para-empresas",
        "/servicios/sistemas-a-medida",
        "/#contacto",
      ],
      path: "/servicios",
    },
    {
      heading: "Websites, custom systems, and automation for businesses.",
      hrefs: [
        "/en/services/business-websites",
        "/en/services/custom-software",
        "/en#contacto",
      ],
      path: "/en/services",
    },
  ])("renders three identical full-row links on $path", async ({ heading, hrefs, path }) => {
    renderApp(path);
    await screen.findByRole("heading", { level: 1, name: heading });

    const directory = document.querySelector(
      '[aria-labelledby="services-directory"]',
    );
    expect(directory).not.toBeNull();
    if (directory === null) throw new Error("Missing service directory");

    const rows = Array.from(
      directory.querySelectorAll<HTMLAnchorElement>(
        "a[data-service-directory-item]",
      ),
    );
    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.getAttribute("href"))).toEqual(hrefs);
    expect(
      new Set(rows.map((row) => row.dataset.interactionContract)),
    ).toEqual(new Set(["service-directory-row"]));

    for (const row of rows) {
      expect(row.querySelector("a")).toBeNull();
      expect(row).toHaveClass(
        "min-h-[44px]",
        "active:bg-white/[0.03]",
        "focus-visible:ring-2",
        "focus-visible:ring-inset",
      );
      expect(row.querySelectorAll("[data-service-directory-arrow]")).toHaveLength(
        1,
      );
      expect(row.querySelector("h3")).toHaveClass(
        "group-hover:text-primary",
        "group-active:text-primary",
        "group-focus-visible:text-primary",
      );
    }

    const automationRow = rows[2];
    expect(automationRow).toBeDefined();
    if (automationRow === undefined) throw new Error("Missing automation row");
    const automationCta = within(automationRow).getByText(
      path.startsWith("/en")
        ? "Tell me which process you want to automate"
        : "Contame qué proceso querés automatizar",
    );
    expect(automationCta).toHaveClass("text-primary");
    expect(automationCta.className).not.toContain("hover:text-white");
  });

  it("reuses the editorial note pattern and scopes the wider H1 to Business Websites", async () => {
    const businessPage = renderApp("/servicios/sitios-web-para-empresas");
    const businessHeading = await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web profesionales para empresas.",
    });
    expect(businessHeading).toHaveAttribute(
      "data-hero-width",
      "business-websites",
    );
    expect(businessHeading).toHaveClass("max-w-[52rem]", "lg:max-w-[64rem]");

    const projectNote = screen.getByText(approvedProjectNoteEs);
    expect(projectNote).toHaveAttribute("data-editorial-note");
    expect(projectNote).toHaveClass(
      "border-l",
      "lg:max-w-none",
      "text-gray-800",
    );
    expect(projectNote.className).not.toMatch(/bg-|shadow/);
    businessPage.unmount();

    renderApp("/servicios");
    const hubHeading = await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web, sistemas y automatización para empresas.",
    });
    expect(hubHeading).toHaveClass("max-w-[52rem]");
    expect(hubHeading).not.toHaveClass("lg:max-w-[64rem]");
    expect(
      screen.getByText(
        "Algunos proyectos combinan las tres cosas. El alcance se define por el problema, no por la tecnología.",
      ),
    ).toHaveClass("border-l", "lg:max-w-[64rem]");
  });

  it("localizes only Spanish geo copy and preserves the English construction", () => {
    const spanishPages = JSON.stringify(translations.es.servicesPages);
    const englishPages = JSON.stringify(translations.en.servicesPages);

    expect(spanishPages).not.toContain("South Florida");
    expect(spanishPages.match(/sur de Florida/g)?.length ?? 0).toBeGreaterThanOrEqual(
      4,
    );
    expect(translations.es.servicesPages.hub.coverage.text).toBe(
      approvedCoverageEs,
    );
    expect(translations.es.servicesPages.web.coverage.text).toBe(
      approvedCoverageEs,
    );
    expect(translations.es.servicesPages.systems.coverage.text).toBe(
      approvedCoverageEs,
    );
    expect(englishPages).toContain("South Florida");
    expect(englishPages).not.toContain("sur de Florida");
  });

  it("locks the exact localized project notes and focused source contracts", () => {
    expect(translations.es.servicesPages.web.cases.note).toBe(
      approvedProjectNoteEs,
    );
    expect(translations.en.servicesPages.web.cases.note).toBe(
      approvedProjectNoteEn,
    );

    const businessSource = fs.readFileSync(
      path.join(projectRoot, "src/pages/BusinessWebsitesPage.tsx"),
      "utf8",
    );
    const systemsSource = fs.readFileSync(
      path.join(projectRoot, "src/pages/CustomSoftwarePage.tsx"),
      "utf8",
    );
    const hubSource = fs.readFileSync(
      path.join(projectRoot, "src/pages/ServicesHubPage.tsx"),
      "utf8",
    );

    expect(businessSource).toContain('data-hero-width="business-websites"');
    expect(businessSource).toContain("lg:max-w-[64rem]");
    expect(systemsSource).not.toContain('data-hero-width="business-websites"');
    expect(hubSource).not.toContain('data-hero-width="business-websites"');
    expect(hubSource.match(/<ServiceDirectoryItem/g)).toHaveLength(3);
    expect(hubSource.match(/<EditorialNote/g)).toHaveLength(1);
    expect(businessSource.match(/<EditorialNote/g)).toHaveLength(1);
  });
});
