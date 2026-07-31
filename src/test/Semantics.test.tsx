import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Link, MemoryRouter, useNavigate } from "react-router-dom";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";

const routes = [
  { pathname: "/", language: "es", skipLabel: "Saltar al contenido principal" },
  { pathname: "/portfolio", language: "es", skipLabel: "Saltar al contenido principal" },
  { pathname: "/portfolio/lem-box", language: "es", skipLabel: "Saltar al contenido principal" },
  { pathname: "/en", language: "en", skipLabel: "Skip to main content" },
  { pathname: "/en/portfolio", language: "en", skipLabel: "Skip to main content" },
  { pathname: "/en/portfolio/lem-box", language: "en", skipLabel: "Skip to main content" },
  { pathname: "/no-existe", language: "es", skipLabel: "Saltar al contenido principal" },
] as const;

function renderApp(pathname: string, controls?: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <RoutedLanguageProvider>
        <App />
        {controls}
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

function HistoryControls() {
  const navigate = useNavigate();

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        Back test
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Forward test
      </button>
    </div>
  );
}

function headingLevels(): number[] {
  return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
    (heading) => Number(heading.tagName.slice(1)),
  );
}

describe("semantic accessibility contract", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it.each(routes)(
    "owns one main and a localized first-focusable skip link on $pathname",
    async ({ pathname, skipLabel }) => {
      renderApp(pathname);
      await screen.findByRole("heading", { level: 1 });

      const mains = screen.getAllByRole("main");
      expect(mains).toHaveLength(1);
      const main = mains[0];
      expect(main).toHaveAttribute("id", "main-content");
      expect(main).toHaveAttribute("tabindex", "-1");

      const navigation = screen.getByRole("navigation");
      const footer = screen.getByRole("contentinfo");
      expect(main).not.toContainElement(navigation);
      expect(main).not.toContainElement(footer);

      const skipLink = screen.getByRole("link", { name: skipLabel });
      expect(skipLink).toHaveAttribute("href", "#main-content");
      const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      expect(focusableElements[0]).toBe(skipLink);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      const levels = headingLevels();
      for (let index = 1; index < levels.length; index += 1) {
        expect(levels[index]).toBeLessThanOrEqual((levels[index - 1] ?? 0) + 1);
      }
    },
  );

  it("does not move focus on the first mount of a public route", async () => {
    renderApp("/");
    await screen.findByRole("heading", { level: 1 });

    expect(document.activeElement).toBe(document.body);
  });

  it("focuses the shared main on direct 404 access and after route changes", async () => {
    const user = userEvent.setup();
    renderApp("/no-existe");

    const main = await screen.findByRole("main");
    await waitFor(() => expect(main).toHaveFocus());

    await user.click(screen.getByRole("link", { name: "Volver al inicio" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    expect(main).toHaveFocus();

    await user.click(screen.getByRole("link", { name: "Portfolio" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    expect(main).toHaveFocus();
  });

  it("activates the skip link and focuses main content", async () => {
    const user = userEvent.setup();
    renderApp("/");
    const main = screen.getByRole("main");

    await user.click(
      screen.getByRole("link", { name: "Saltar al contenido principal" }),
    );

    expect(main).toHaveFocus();
  });

  it("focuses an existing hash target and removes its temporary tabindex on blur", async () => {
    const user = userEvent.setup();
    renderApp(
      "/portfolio",
      <Link to="/#contacto">Open contact hash</Link>,
    );
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("link", { name: "Open contact hash" }));
    const target = await waitFor(() => {
      const contact = document.getElementById("contacto");
      expect(contact).toHaveFocus();
      return contact;
    });
    if (target === null) throw new Error("Missing contact target");
    expect(target).toHaveAttribute("tabindex", "-1");

    screen.getByRole("main").focus();
    expect(target).not.toHaveAttribute("tabindex");
  });

  it("falls back to main when a client-side hash target does not exist", async () => {
    const user = userEvent.setup();
    renderApp("/", <Link to="/portfolio#missing-target">Missing hash</Link>);

    await user.click(screen.getByRole("link", { name: "Missing hash" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus(), {
      timeout: 800,
    });
  });

  it("uses automatic hash scrolling when reduced motion is requested", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    const user = userEvent.setup();
    renderApp("/portfolio", <Link to="/#contacto">Reduced contact hash</Link>);

    await user.click(
      await screen.findByRole("link", { name: "Reduced contact hash" }),
    );
    const target = await waitFor(() => {
      const contact = document.getElementById("contacto");
      expect(contact).toHaveFocus();
      return contact;
    });
    if (target === null) throw new Error("Missing contact target");
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });

  it("focuses main for language changes and browser history navigation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/", "/portfolio"]} initialIndex={1}>
        <RoutedLanguageProvider>
          <App />
          <HistoryControls />
        </RoutedLanguageProvider>
      </MemoryRouter>,
    );
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    const main = screen.getByRole("main");

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "Some Work" });
    expect(main).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Back test" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    expect(main).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Back test" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    expect(main).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Forward test" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    expect(main).toHaveFocus();
  });

  it("uses button semantics for the Hero selector with four 44px targets", () => {
    renderApp("/");
    const group = screen.getByRole("group", { name: "Navegación de slides" });
    const buttons = within(group).getAllByRole("button");

    expect(buttons).toHaveLength(4);
    expect(buttons.filter((button) => button.getAttribute("aria-pressed") === "true"))
      .toHaveLength(1);
    for (const button of buttons) {
      expect(button).toHaveClass("h-11", "w-11");
      expect(button).not.toHaveAttribute("role", "tab");
      expect(button).not.toHaveAttribute("aria-controls");
      expect(button).not.toHaveAttribute("aria-selected");
    }
    expect(document.querySelector('[role="tablist"], [role="tab"]')).toBeNull();
  });

  it("keeps contextual Portfolio headings and unique accessible action names", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    const cardHeading = await screen.findByRole("heading", {
      level: 2,
      name: "ZENTRA",
    });
    const card = cardHeading.closest("[id^='portfolio-case-']");
    expect(card).toBeInstanceOf(HTMLElement);
    if (!(card instanceof HTMLElement)) throw new Error("Missing ZENTRA card");

    const expandButton = within(card).getByRole("button", {
      name: "Ver más: ZENTRA",
    });
    expect(expandButton).toHaveTextContent("Ver más");
    await user.click(expandButton);
    expect(within(card).getByRole("heading", { level: 3, name: "Mi rol" }))
      .toBeInTheDocument();
    expect(within(card).getByRole("button", { name: "Ver menos: ZENTRA" }))
      .toHaveFocus();

    expect(
      screen.getByRole("link", { name: "Ver caso completo: LEM-BOX" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Ver sitio web: Esteban Firpo · Miami Real Estate",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "Some Work" });
    expect(
      screen.getByRole("link", {
        name: "View website: Esteban Firpo · Miami Real Estate",
      }),
    ).toBeInTheDocument();
  });

  it("keeps Home project titles at h3 beneath the section h2", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "Proyectos seleccionados",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "LEM-BOX" }),
    ).toBeInTheDocument();
  });

  it("keeps English Portfolio control names unique without changing visible copy", async () => {
    renderApp("/en/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Some Work" });

    expect(
      screen.getByRole("button", { name: "View more: ZENTRA" }),
    ).toHaveTextContent("View details");
    expect(
      screen.getByRole("link", { name: "View full case study: LEM-BOX" }),
    ).toHaveTextContent("View full case study");
  });

  it("keeps decorative imagery silent and preserves meaningful image names", async () => {
    renderApp("/");
    await screen.findByRole("heading", { level: 1 });

    expect(screen.getByRole("img", { name: "Rodrigo Opalo" })).toBeInTheDocument();
    expect(
      document.querySelector('img[src="/img/certs/ibm-fullstack.png"]'),
    ).toHaveAttribute("alt", "");
    for (const source of [
      "/img/hero-visual.jpg",
      "/img/hero-visual-mobile.jpg",
      "/img/impact.jpg",
      "/img/experience.jpg",
      "/img/servicios.jpg",
    ]) {
      expect(document.querySelector(`img[src="${source}"]`)).toHaveAttribute(
        "alt",
        "",
      );
    }
  });
});
