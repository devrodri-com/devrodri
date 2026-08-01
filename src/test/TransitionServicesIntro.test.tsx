import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";
import TransitionServicesIntro from "../Components/TransitionServicesIntro";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";
import portfolioSource from "../Components/PortfolioSection.tsx?raw";

function renderBridge(
  language: Language,
  variant: "default" | "afterPortfolio" = "default",
) {
  localStorage.setItem("language", language);
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <TransitionServicesIntro variant={variant} />
      </LanguageProvider>
    </MemoryRouter>,
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

  it("keeps the approved panoramic layout while delivering responsive variants", () => {
    renderBridge("es");
    const bridge = getBridgeSection(
      screen.getByRole("heading", {
        level: 2,
        name: "Del enfoque a la implementación.",
      }),
    );
    const image = bridge.querySelector<HTMLImageElement>(
      'img[data-home-image="servicios"]',
    );
    const picture = image?.closest("picture");
    const imageContainer = picture?.parentElement;

    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveAttribute("width", "480");
    expect(image).toHaveAttribute("height", "160");
    expect(image).toHaveAttribute(
      "sizes",
      "(min-width: 1200px) 1152px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
    );
    expect(image).toHaveClass(
      "w-full",
      "h-24",
      "object-cover",
      "object-center",
      "sm:h-28",
      "md:h-32",
    );
    expect(picture).toHaveClass("block");
    expect(picture?.querySelectorAll("img")).toHaveLength(1);
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
  });

  it("renders the approved Spanish next-step flow without a secondary email link", () => {
    renderBridge("es", "afterPortfolio");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "De la idea a una solución clara",
    });
    const section = getBridgeSection(heading);
    const cta = screen.getByRole("link", {
      name: "Contame tu proyecto",
    });

    expect(section).toHaveTextContent("PRÓXIMO PASO");
    expect(section).toHaveTextContent(
      "Contame el contexto y definimos el alcance, las prioridades y el mejor camino para avanzar.",
    );
    expect(section).toHaveTextContent("Contacto directo");
    expect(section).toHaveTextContent("Alcance claro");
    expect(section).toHaveTextContent("Solución a medida");
    expect(cta).toHaveTextContent("Contame tu proyecto");
    expect(cta).toHaveAttribute("href", "/#contacto");
    expect(cta).toHaveAttribute("data-analytics", "bridge-cta-afterPortfolio");
    expect(section.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    expect(section.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(section.querySelector(".sm\\:grid-cols-3")).toBeInTheDocument();
  });

  it("renders the approved English next-step flow with the same structure", () => {
    renderBridge("en", "afterPortfolio");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "From an idea to a clear solution",
    });
    const section = getBridgeSection(heading);
    const cta = screen.getByRole("link", {
      name: "Tell me about your project",
    });

    expect(section).toHaveTextContent("NEXT STEP");
    expect(section).toHaveTextContent(
      "Tell me the context and we'll define the scope, priorities, and best way forward.",
    );
    expect(section).toHaveTextContent("Direct communication");
    expect(section).toHaveTextContent("Clear scope");
    expect(section).toHaveTextContent("Tailored solution");
    expect(cta).toHaveTextContent("Tell me about your project");
    expect(cta).toHaveAttribute("href", "/en#contacto");
    expect(section.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    expect(section.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(section.textContent).not.toMatch(/[\u2013\u2014]/);
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
    expect(portfolio).toHaveClass(
      "relative",
      "py-28",
      "px-4",
      "sm:px-6",
      "text-white",
      "overflow-hidden",
    );
    expect(portfolio).not.toHaveAttribute("style");
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

    const grid = portfolio?.querySelector(".grid");
    const cardLinks = Array.from(grid?.children ?? []);
    const cards = cardLinks.map((link) => link.firstElementChild);

    expect(grid).toHaveClass("gap-6", "md:grid-cols-2");
    expect(cardLinks).toHaveLength(4);
    expect(cardLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/portfolio/lem-box",
      "/portfolio",
      "/portfolio",
      "/portfolio",
    ]);
    cards.forEach((card) => {
      expect(card).toHaveClass(
        "backdrop-blur",
        "shadow-md",
        "transition-all",
        "duration-300",
        "motion-reduce:transition-none",
        "hover:-translate-y-1",
        "hover:shadow-lg",
      );
    });

    expect(portfolioSource).toContain('<section\n      id="portfolio"');
    expect(portfolioSource).not.toContain("<motion.section");
    expect(portfolioSource).not.toContain("initial={false}");
    expect(portfolioSource).toContain("initial={{ opacity: 0, y: 20 }}");
    expect(portfolioSource).toContain("whileInView={{ opacity: 1, y: 0 }}");
    expect(portfolioSource).toContain(
      "transition={{ duration: 0.45, delay: 0.05 * index }}",
    );
    expect(portfolioSource).toContain("viewport={{ once: true }}");
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
