import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import TransitionServicesIntro from "../Components/TransitionServicesIntro";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

interface FileSystemApi {
  existsSync(path: string): boolean;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");

function renderBridge(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <TransitionServicesIntro />
    </LanguageProvider>,
  );
}

function getBridgeSection(heading: HTMLElement): HTMLElement {
  const section = heading.closest("section");
  if (!(section instanceof HTMLElement)) {
    throw new Error("Expected the portfolio bridge section");
  }
  return section;
}

describe("TransitionServicesIntro portfolio bridge", () => {
  it("renders the approved compact Spanish bridge without historical CTA content", () => {
    const rendered = renderBridge("es");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Del enfoque a la implementación.",
    });
    const section = getBridgeSection(heading);

    expect(section).toHaveTextContent("CASOS SELECCIONADOS");
    expect(section).toHaveTextContent(
      "Proyectos donde estrategia, producto y tecnología se combinan para resolver necesidades concretas.",
    );
    expect(section).not.toHaveTextContent("PRÓXIMO PASO");
    expect(section).not.toHaveTextContent("Construyamos algo increíble");
    expect(section.querySelector("img")).not.toBeInTheDocument();
    expect(section.querySelector("button")).not.toBeInTheDocument();
    expect(section.textContent).not.toMatch(/[\u2013\u2014]/);
    expect(
      rendered.container.querySelector('[src="/img/servicios.jpg"]'),
    ).not.toBeInTheDocument();
  });

  it("renders the approved English bridge without historical CTA content", () => {
    renderBridge("en");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "From approach to implementation.",
    });
    const section = getBridgeSection(heading);

    expect(section).toHaveTextContent("SELECTED WORK");
    expect(section).toHaveTextContent(
      "Projects where strategy, product thinking, and technology come together to solve specific business needs.",
    );
    expect(section).not.toHaveTextContent("NEXT STEP");
    expect(section).not.toHaveTextContent("Let’s build something great");
    expect(section.querySelector("img")).not.toBeInTheDocument();
    expect(section.querySelector("button")).not.toBeInTheDocument();
    expect(section.textContent).not.toMatch(/[\u2013\u2014]/);
  });

  it("keeps the panoramic asset and Portfolio immediately after the bridge", () => {
    localStorage.setItem("language", "es");
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const bridge = getBridgeSection(
      screen.getByRole("heading", {
        level: 2,
        name: "Del enfoque a la implementación.",
      }),
    );
    const portfolio = bridge.nextElementSibling;

    expect(portfolio).toBeInstanceOf(HTMLElement);
    expect(portfolio).toHaveAttribute("id", "portfolio");
    expect(portfolio).toHaveTextContent("Algunos resultados recientes");
    expect(fs.existsSync("public/img/servicios.jpg")).toBe(true);
  });
});
