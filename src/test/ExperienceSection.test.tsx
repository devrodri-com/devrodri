import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExperienceSection from "../Components/ExperienceSection";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

function renderExperience(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <ExperienceSection />
    </LanguageProvider>,
  );
}

function getExperienceSection(container: HTMLElement): HTMLElement {
  const section = container.querySelector("#experiencia");
  if (!(section instanceof HTMLElement)) {
    throw new Error("Expected the Experience section");
  }
  return section;
}

describe("ExperienceSection positioning", () => {
  it("reserves the approved 3:2 image and responsive delivery contract", () => {
    const rendered = renderExperience("es");
    const image = rendered.container.querySelector<HTMLImageElement>(
      'img[data-home-image="experience"]',
    );
    const sources = Array.from(
      image?.closest("picture")?.querySelectorAll("source") ?? [],
    );

    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("width", "1536");
    expect(image).toHaveAttribute("height", "1024");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
    expect(sources.map((source) => source.type)).toEqual([
      "image/avif",
      "image/webp",
    ]);
    expect(image).toHaveClass("object-cover", "w-full", "h-full");
    expect(image).toHaveStyle({ objectPosition: "53% 50%" });
  });

  it("renders the approved Spanish positioning", () => {
    const rendered = renderExperience("es");
    const section = getExperienceSection(rendered.container);

    expect(section).toHaveTextContent(
      "Tecnología que conecta producto, sistemas y negocio.",
    );
    expect(section).toHaveTextContent(
      "Trabajo directamente con cada cliente para entender qué necesita el negocio y convertirlo en una solución clara: sitios, aplicaciones, automatizaciones e integraciones que pueden evolucionar por etapas.",
    );
    expect(section).not.toHaveTextContent("Más que diseño");
    expect(section).toHaveAttribute("data-section", "experience");
  });

  it("renders the approved English positioning", () => {
    const rendered = renderExperience("en");
    const section = getExperienceSection(rendered.container);

    expect(section).toHaveTextContent(
      "Technology that connects product, systems, and business.",
    );
    expect(section).toHaveTextContent(
      "I work directly with each client to understand what the business needs and turn it into a clear solution: websites, applications, automations, and integrations that can evolve in stages.",
    );
    expect(section).not.toHaveTextContent("More than design");
  });
});
