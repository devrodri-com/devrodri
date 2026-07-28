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
        "Trabajo directamente con cada cliente para entender el negocio y definir prioridades. Después construyo la solución adecuada: un sitio web, un sistema a medida, una automatización o una presencia digital completa.",
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
    expect(screen.getByText(/Evolución por etapas/)).toBeInTheDocument();
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
        "I work directly with each client to understand the business and define priorities. Then I build the right solution: a website, a custom system, an automation, or a complete digital presence.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View case studies" }),
    ).toHaveAttribute("href", "/portfolio");
    expect(
      screen.getByRole("link", { name: "Tell me about your project" }),
    ).toHaveAttribute("href", "#contacto");
    expect(screen.getByText(/Discovery and scope/)).toBeInTheDocument();
    expect(screen.getByText(/Custom development/)).toBeInTheDocument();
    expect(screen.getByText(/Built in stages/)).toBeInTheDocument();
    expect(screen.queryByText("Speed 90+")).not.toBeInTheDocument();
    expect(screen.queryByText("Technical SEO")).not.toBeInTheDocument();
    expect(screen.queryByText("Request proposal")).not.toBeInTheDocument();
  });
});
