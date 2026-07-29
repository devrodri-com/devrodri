import { render, screen, within } from "@testing-library/react";
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
  it("renders the approved Spanish copy with the original visual layout", () => {
    renderBridge("es");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Del enfoque a la implementación.",
    });
    const section = getBridgeSection(heading);

    expect(section).toHaveTextContent("EN LA PRÁCTICA");
    expect(section).toHaveTextContent(
      "Cada proyecto convierte una necesidad concreta en una solución digital funcional y preparada para evolucionar.",
    );
    expect(section).not.toHaveTextContent("CASOS SELECCIONADOS");
    expect(section).not.toHaveTextContent("PRÓXIMO PASO");
    expect(section).not.toHaveTextContent("Construyamos algo increíble");
    expect(section).not.toHaveTextContent(
      "Ahora que sabés cómo trabajo, veamos qué podemos construir juntos.",
    );
    expect(section.querySelector("button")).not.toBeInTheDocument();
    expect(section.textContent).not.toMatch(/[\u2013\u2014]/);
    expect(section).toHaveClass("py-10");
    expect(section).not.toHaveClass("sm:py-12");
  });

  it("renders the approved English copy with the original visual layout", () => {
    renderBridge("en");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "From approach to implementation.",
    });
    const section = getBridgeSection(heading);

    expect(section).toHaveTextContent("IN PRACTICE");
    expect(section).toHaveTextContent(
      "Each project turns a specific need into a functional digital solution designed to evolve.",
    );
    expect(section).not.toHaveTextContent("SELECTED WORK");
    expect(section).not.toHaveTextContent("NEXT STEP");
    expect(section).not.toHaveTextContent("Let’s build something great");
    expect(section).not.toHaveTextContent(
      "Now that you know how I work, let’s see what we can build together.",
    );
    expect(section.querySelector("button")).not.toBeInTheDocument();
    expect(section.textContent).not.toMatch(/[\u2013\u2014]/);
  });

  it("restores the original panoramic image, container, and responsive crop", () => {
    renderBridge("es");
    const bridge = getBridgeSection(
      screen.getByRole("heading", {
        level: 2,
        name: "Del enfoque a la implementación.",
      }),
    );
    const image = bridge.querySelector('img[src="/img/servicios.jpg"]');
    const imageContainer = image?.parentElement;

    expect(image).toHaveAttribute("alt", "Servicios");
    expect(image).toHaveClass(
      "w-full",
      "h-24",
      "object-cover",
      "object-center",
      "sm:h-28",
      "md:h-32",
    );
    expect(imageContainer).toHaveClass(
      "mt-6",
      "rounded-3xl",
      "overflow-hidden",
      "shadow-xl",
      "transition",
      "hover:shadow-2xl",
      "w-full",
      "max-w-[1600px]",
      "mx-auto",
    );
    expect(fs.existsSync("public/img/servicios.jpg")).toBe(true);
  });

  it("keeps Portfolio immediately after the bridge with its anchor intact", () => {
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
    expect(portfolio).toHaveTextContent("PORTFOLIO");
    expect(portfolio).toHaveTextContent("Proyectos seleccionados");
    expect(portfolio).toHaveTextContent(
      "Sitios, sistemas, automatizaciones y proyectos de marca desarrollados para resolver necesidades reales de negocio.",
    );
    expect(portfolio).not.toHaveTextContent("Algunos resultados recientes");
    expect(portfolio).not.toHaveTextContent(
      "Sitios a medida para servicios, e-commerce y marcas personales",
    );
    expect(portfolio).not.toHaveTextContent(
      "Diseño limpio, SEO técnico y rendimiento listo para escalar",
    );
    expect(
      within(portfolio as HTMLElement).getAllByRole("heading", { level: 2 }),
    ).toHaveLength(1);
  });

  it("renders the single approved English Portfolio introduction", () => {
    localStorage.setItem("language", "en");
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const portfolio = document.getElementById("portfolio");

    expect(portfolio).toBeInstanceOf(HTMLElement);
    expect(portfolio).toHaveTextContent("PORTFOLIO");
    expect(portfolio).toHaveTextContent("Selected projects");
    expect(portfolio).toHaveTextContent(
      "Websites, systems, automations, and brand projects built to solve real business needs.",
    );
    expect(portfolio).not.toHaveTextContent("Recent work & results");
    expect(portfolio).not.toHaveTextContent(
      "Custom sites for services, e-commerce and personal brands",
    );
    expect(portfolio).not.toHaveTextContent(
      "Clean design, technical SEO and performance ready to scale",
    );
    expect(
      within(portfolio as HTMLElement).getAllByRole("heading", { level: 2 }),
    ).toHaveLength(1);
  });
});
