import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HighlightsSection from "../Components/HighlightsSection";
import highlightsSource from "../Components/HighlightsSection.tsx?raw";
import { LanguageProvider } from "../i18n/LanguageProvider";

function renderHighlights() {
  return render(
    <LanguageProvider>
      <HighlightsSection />
    </LanguageProvider>,
  );
}

function getHighlightsSection(container: HTMLElement): HTMLElement {
  const section = container.querySelector("#porqueelegirnos");
  if (!(section instanceof HTMLElement)) {
    throw new Error("Expected the Highlights section");
  }
  return section;
}

describe("HighlightsSection static background", () => {
  it("uses the approved responsive image over the CSS fallback without video media", () => {
    localStorage.setItem("language", "es");
    const rendered = renderHighlights();
    const section = getHighlightsSection(rendered.container);
    const background = section.querySelector("[data-highlights-background]");
    const image = section.querySelector("[data-highlights-image]");
    const source = section.querySelector("picture source");

    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute("aria-hidden", "true");
    expect(source).toHaveAttribute("media", "(min-width: 1024px)");
    expect(source).toHaveAttribute(
      "srcset",
      "/img/highlights-systems-bg.jpg",
    );
    expect(image).not.toHaveAttribute("src");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveAttribute("width", "1672");
    expect(image).toHaveAttribute("height", "941");
    expect(image).toHaveClass(
      "absolute",
      "inset-0",
      "hidden",
      "h-full",
      "w-full",
      "object-cover",
      "object-center",
      "lg:block",
    );
    expect(highlightsSource).not.toContain("data:image/gif");
    expect(section.querySelector("video")).not.toBeInTheDocument();
    expect(section.querySelector("video source")).not.toBeInTheDocument();
    expect(section).not.toHaveTextContent("WEBSITE");
  });
});

describe("HighlightsSection positioning", () => {
  it("renders the six approved concepts and icons in Spanish", () => {
    localStorage.setItem("language", "es");
    const rendered = renderHighlights();
    const section = getHighlightsSection(rendered.container);

    expect(section).toHaveTextContent("¿Por qué trabajar conmigo?");
    for (const text of [
      "Visión de producto",
      "Defino cada solución desde el problema, el usuario y la prioridad del negocio.",
      "Tecnología con propósito",
      "Elijo herramientas por su utilidad, mantenibilidad y capacidad de acompañar el proyecto.",
      "Comunicación directa",
      "Trabajás conmigo de principio a fin, con decisiones claras y sin intermediarios.",
      "Experiencia real de negocio",
      "Aplico una mirada práctica sobre operación, clientes y decisiones de producto.",
      "Automatización e integraciones",
      "Conecto sistemas y herramientas para reducir tareas manuales y mejorar procesos.",
      "Evolución por etapas",
      "Priorizamos lo esencial y construimos una base que puede crecer sin complicar el MVP.",
    ]) {
      expect(section).toHaveTextContent(text);
    }
    expect(section.querySelectorAll("h3")).toHaveLength(6);
    expect(
      Array.from(
        section.querySelectorAll<SVGElement>("[data-highlight-icon]"),
        (icon) => icon.dataset.highlightIcon,
      ),
    ).toEqual([
      "product",
      "purpose",
      "direct",
      "business",
      "automation",
      "stages",
    ]);
    expect(section).not.toHaveTextContent("Velocidad y rendimiento");
    expect(section).not.toHaveTextContent("Diseño responsive");
    expect(section).not.toHaveTextContent("SEO integrado");
    expect(section).not.toHaveTextContent("Pagos online embebidos");
  });

  it("renders the equivalent positioning in English", () => {
    localStorage.setItem("language", "en");
    const rendered = renderHighlights();
    const section = getHighlightsSection(rendered.container);

    expect(section).toHaveTextContent("Why work with me?");
    for (const text of [
      "Product vision",
      "I shape each solution around the problem, the user, and the business priority.",
      "Purposeful technology",
      "I choose tools for their usefulness, maintainability, and fit for the project.",
      "Direct communication",
      "You work directly with me from start to finish, with clear decisions and no intermediaries.",
      "Real business experience",
      "I bring a practical perspective on operations, customers, and product decisions.",
      "Automation and integrations",
      "I connect systems and tools to reduce manual work and improve processes.",
      "Phased evolution",
      "We prioritize what matters and build a foundation that can grow without overcomplicating the MVP.",
    ]) {
      expect(section).toHaveTextContent(text);
    }
    expect(section.querySelectorAll("h3")).toHaveLength(6);
  });
});
