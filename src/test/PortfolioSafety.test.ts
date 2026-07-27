import { describe, expect, it, vi } from "vitest";
import {
  homePortfolioCases,
  isProjectKey,
  portfolioCases,
  projectKeys,
} from "../data/portfolio";
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

const expectedProjectKeys = [
  "magenta",
  "esteban",
  "lem_web",
  "lem_portal",
  "mutter",
  "federico",
  "boating",
  "campings_demo",
];
const expectedHomeKeys = expectedProjectKeys.slice(0, 6);
const campingsRepository =
  "https://github.com/devrodri-com/reservas-campings-nacionales";
const removedLiveDemo = [
  "https://reservas-campings-nacionales",
  "vercel.app",
].join(".");

describe("portfolio architecture invariants", () => {
  it("derives eight unique keys in the exact portfolio order", () => {
    expect(projectKeys).toEqual(expectedProjectKeys);
    expect(new Set(projectKeys).size).toBe(8);
    expect(portfolioCases.map(({ portfolioOrder }) => portfolioOrder)).toEqual(
      [0, 1, 2, 3, 4, 5, 6, 7],
    );
    expect(isProjectKey("magenta")).toBe(true);
    expect(isProjectKey("campings_demo")).toBe(true);
    expect(isProjectKey("toString")).toBe(false);
    expect(isProjectKey("unknown")).toBe(false);
  });

  it("derives the six home highlights from the central catalog", () => {
    expect(homePortfolioCases.map(({ key }) => key)).toEqual(expectedHomeKeys);
    expect(homePortfolioCases.map(({ home }) => home.order)).toEqual([
      0, 1, 2, 3, 4, 5,
    ]);
  });

  it("keeps Campings last, conceptual, not featured, and GitHub-only", () => {
    const campings = portfolioCases.find(
      (portfolioCase) => portfolioCase.key === "campings_demo",
    );

    expect(campings).toBeDefined();
    if (campings === undefined) {
      throw new Error("Campings is missing from the portfolio catalog");
    }

    expect(portfolioCases[portfolioCases.length - 1]?.key).toBe(
      "campings_demo",
    );
    expect(campings.home).toBeUndefined();
    expect(campings.actions.map(({ href }) => href)).toEqual([
      campingsRepository,
    ]);
    expect(campings.content.es.status).toBe(
      translations.es.portfolio.campings_demo.status,
    );
    expect(campings.content.es.disclaimer).toBe(
      translations.es.portfolio.campings_demo.disclaimer,
    );
    expect(campings.content.en.status).toBe(
      translations.en.portfolio.campings_demo.status,
    );
    expect(campings.content.en.disclaimer).toBe(
      translations.en.portfolio.campings_demo.disclaimer,
    );
    expect(JSON.stringify({ portfolioCases, translations })).not.toContain(
      removedLiveDemo,
    );
  });

  it("uses explicit card slots and a stable FAQ id contract", () => {
    const portfolioCardSource = fs.readFileSync(
      path.join(
        projectRoot,
        "src/Components/portfolio/PortfolioCard.tsx",
      ),
      "utf8",
    );
    const faqSource = fs.readFileSync(
      path.join(projectRoot, "src/Components/FaqSection.tsx"),
      "utf8",
    );

    expect(portfolioCardSource).toContain("actions: ReactNode");
    expect(portfolioCardSource).toContain("details: ReactNode");
    expect(portfolioCardSource).not.toContain("Children.toArray");
    expect(portfolioCardSource).not.toContain("isValidElement");
    expect(portfolioCardSource).not.toContain("className?.includes");
    expect(faqSource).toContain('faq.id === "technologies"');
    expect(faqSource).not.toMatch(/tecnolog\|technolog/);
  });
});
