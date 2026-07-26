import { describe, expect, it } from "vitest";
import { projects } from "../data/portfolioCases";
import translations from "../translations";

const CAMPINGS_REPOSITORY =
  "https://github.com/devrodri-com/reservas-campings-nacionales";
const REMOVED_LIVE_DEMO = [
  "https://reservas-campings-nacionales",
  "vercel.app",
].join(".");

describe("portfolio safety invariants", () => {
  it("keeps exactly eight projects with Campings last", () => {
    expect(projects).toHaveLength(8);
    expect(projects[projects.length - 1]?.key).toBe("campings_demo");
  });

  it("keeps the Campings title and disclaimer in Spanish and English", () => {
    const spanish = translations.es.portfolio.campings_demo;
    const english = translations.en.portfolio.campings_demo;

    expect(spanish.title).toBeTruthy();
    expect(spanish.disclaimer).toBeTruthy();
    expect(english.title).toBeTruthy();
    expect(english.disclaimer).toBeTruthy();
  });

  it("exposes only the sanitized GitHub repository for Campings", () => {
    const campings = projects.find((project) => project.key === "campings_demo");

    expect(campings?.href).toBe(CAMPINGS_REPOSITORY);
    expect(JSON.stringify({ projects, translations })).not.toContain(
      REMOVED_LIVE_DEMO,
    );
  });
});
