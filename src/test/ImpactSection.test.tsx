import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ImpactSection from "../Components/ImpactSection";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

function renderImpactSection(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <ImpactSection />
    </LanguageProvider>,
  );
}

describe("ImpactSection", () => {
  it("reserves the approved 3:2 image and responsive delivery contract", () => {
    const { container } = renderImpactSection("es");
    const image = container.querySelector<HTMLImageElement>(
      'img[data-home-image="impact"]',
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
    expect(image).toHaveClass("object-cover", "w-full", "h-full", "object-right");
    expect(image).toHaveStyle({ objectPosition: "72% 46%" });
  });

  it("presents the approved problem-first positioning in Spanish", () => {
    renderImpactSection("es");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Primero el problema. Después, la solución.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Trabajo directamente con cada cliente para entender su negocio, definir prioridades y construir una solución útil, clara y preparada para crecer.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver casos" })).toHaveAttribute(
      "href",
      "/portfolio",
    );
    expect(
      screen.getByRole("link", { name: "Contame tu proyecto" }),
    ).toHaveAttribute("href", "#contacto");
    expect(screen.getByText(/Diagnóstico y alcance/)).toBeInTheDocument();
    expect(screen.getByText(/Desarrollo a medida/)).toBeInTheDocument();
    expect(screen.getByText(/Implementación por etapas/)).toBeInTheDocument();
    expect(screen.queryByText("Velocidad 90+")).not.toBeInTheDocument();
    expect(screen.queryByText("SEO técnico")).not.toBeInTheDocument();
    expect(screen.queryByText("Solicitar propuesta")).not.toBeInTheDocument();
  });

  it("presents the approved problem-first positioning in English", () => {
    renderImpactSection("en");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Start with the problem. Build the right solution.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I work directly with each client to understand the business, define priorities, and build a clear, useful solution designed to grow.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View case studies" }),
    ).toHaveAttribute("href", "/en/portfolio");
    expect(
      screen.getByRole("link", { name: "Tell me about your project" }),
    ).toHaveAttribute("href", "#contacto");
    expect(screen.getByText(/Discovery and scope/)).toBeInTheDocument();
    expect(screen.getByText(/Custom development/)).toBeInTheDocument();
    expect(screen.getByText(/Phased delivery/)).toBeInTheDocument();
    expect(screen.queryByText("Speed 90+")).not.toBeInTheDocument();
    expect(screen.queryByText("Technical SEO")).not.toBeInTheDocument();
    expect(screen.queryByText("Request proposal")).not.toBeInTheDocument();
  });
});
