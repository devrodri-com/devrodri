import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  Link,
  MemoryRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";

type TestEntry =
  | string
  | {
      hash?: string;
      pathname: string;
      search?: string;
      state?: Record<string, unknown>;
    };

const publicRoutes = [
  { path: "/", skip: "Saltar al contenido principal" },
  { path: "/portfolio", skip: "Saltar al contenido principal" },
  { path: "/portfolio/lem-box", skip: "Saltar al contenido principal" },
  { path: "/en", skip: "Skip to main content" },
  { path: "/en/portfolio", skip: "Skip to main content" },
  { path: "/en/portfolio/lem-box", skip: "Skip to main content" },
  { path: "/no-existe", skip: "Saltar al contenido principal" },
] as const;

function renderApp(entry: TestEntry, controls?: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
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

function QueryControl() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ pathname: location.pathname, search: "?next=1" })}
    >
      Change query
    </button>
  );
}

function headingLevels(): number[] {
  return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
    (heading) => Number(heading.tagName.slice(1)),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("semantic navigation contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("language", "es");
  });

  it.each(publicRoutes)(
    "renders one shared main and a localized first skip link on $path",
    async ({ path, skip }) => {
      renderApp(path);
      await screen.findByRole("heading", { level: 1 });

      const mains = screen.getAllByRole("main");
      expect(mains).toHaveLength(1);
      const main = mains[0];
      expect(main).toHaveAttribute("id", "main-content");
      expect(main).toHaveAttribute("tabindex", "-1");
      expect(main).not.toContainElement(screen.getByRole("navigation"));
      expect(main).not.toContainElement(screen.getByRole("contentinfo"));

      const skipLink = screen.getByRole("link", { name: skip });
      expect(skipLink).toHaveAttribute("href", "#main-content");
      const focusable = document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      expect(focusable[0]).toBe(skipLink);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      const levels = headingLevels();
      for (let index = 1; index < levels.length; index += 1) {
        expect(levels[index]).toBeLessThanOrEqual((levels[index - 1] ?? 0) + 1);
      }
    },
  );

  it("does not steal focus on the first mount of a public route or initial hash", async () => {
    const firstRender = renderApp("/");
    await screen.findByRole("heading", { level: 1 });
    expect(document.activeElement).toBe(document.body);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    firstRender.unmount();
    renderApp("/#contacto");
    await screen.findByRole("heading", { level: 1 });
    expect(document.activeElement).toBe(document.body);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it("focuses the shared main once on direct 404 access and preserves its flex shell", async () => {
    renderApp("/no-existe");
    const main = await screen.findByRole("main");
    await waitFor(() => expect(main).toHaveFocus());

    expect(main).toHaveClass("flex", "flex-1");
    expect(main.parentElement).toHaveClass("flex", "flex-col", "min-h-screen");
    expect(main.parentElement).toHaveStyle({ minHeight: "100dvh" });
    expect(main.firstElementChild).toHaveClass("flex-1");
    expect(main.nextElementSibling).toBe(screen.getByRole("contentinfo"));
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    });
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

  it("focuses main after Navbar and Hero pathname navigation", async () => {
    const user = userEvent.setup();
    const firstRender = renderApp("/");
    const main = screen.getByRole("main");

    await user.click(screen.getByRole("link", { name: "Portfolio" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    await waitFor(() => expect(main).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      left: 0,
      top: 0,
    });

    firstRender.unmount();
    vi.mocked(window.scrollTo).mockClear();
    renderApp("/");
    const nextMain = screen.getByRole("main");
    await user.click(screen.getByRole("link", { name: "Ver trabajos" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    await waitFor(() => expect(nextMain).toHaveFocus());
  });

  it("focuses main for Portfolio, language and 404 route transitions", async () => {
    const user = userEvent.setup();
    const portfolioRender = renderApp("/portfolio");
    const main = await screen.findByRole("main");

    await user.click(
      await screen.findByRole("link", { name: "Ver caso completo: LEM-BOX" }),
    );
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });
    await waitFor(() => expect(main).toHaveFocus());

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });
    await waitFor(() => expect(main).toHaveFocus());

    portfolioRender.unmount();
    renderApp("/no-existe");
    const notFoundMain = await screen.findByRole("main");
    await waitFor(() => expect(notFoundMain).toHaveFocus());
    await user.click(screen.getByRole("link", { name: "Volver al inicio" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    await waitFor(() => expect(notFoundMain).toHaveFocus());
  });

  it("focuses a valid hash target and removes only its temporary tabindex", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio", <Link to="/#contacto">Open contact</Link>);

    await user.click(await screen.findByRole("link", { name: "Open contact" }));
    const target = await waitFor(() => {
      const contact = document.getElementById("contacto");
      expect(contact).toHaveFocus();
      return contact;
    });
    if (!(target instanceof HTMLElement)) throw new Error("Missing contact target");
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    screen.getByRole("main").focus();
    expect(target).not.toHaveAttribute("tabindex");
  });

  it("falls back to main when a client-side hash target does not exist", async () => {
    const user = userEvent.setup();
    renderApp("/", <Link to="/portfolio#missing-target">Missing hash</Link>);

    await user.click(screen.getByRole("link", { name: "Missing hash" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    await waitFor(() => expect(screen.getByRole("main")).toHaveFocus(), {
      timeout: 1_200,
    });
  });

  it("uses automatic hash scrolling under reduced motion", async () => {
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
    renderApp("/portfolio", <Link to="/#contacto">Reduced hash</Link>);

    await user.click(await screen.findByRole("link", { name: "Reduced hash" }));
    const target = await waitFor(() => {
      const contact = document.getElementById("contacto");
      expect(contact).toHaveFocus();
      return contact;
    });
    if (!(target instanceof HTMLElement)) throw new Error("Missing contact target");
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });

  it("preserves POP scroll restoration while focusing main", async () => {
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
    vi.mocked(window.scrollTo).mockClear();

    await user.click(screen.getByRole("button", { name: "Back test" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    await waitFor(() => expect(main).toHaveFocus());
    expect(window.scrollTo).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Forward test" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    await waitFor(() => expect(main).toHaveFocus());
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("does not move focus or scroll for query-only navigation", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio?first=1", <QueryControl />);
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    const queryButton = screen.getByRole("button", { name: "Change query" });
    vi.mocked(window.scrollTo).mockClear();

    await user.click(queryButton);

    expect(queryButton).toHaveFocus();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

describe("headings, controls and image semantics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("language", "es");
  });

  it("uses contextual Portfolio headings without changing Home headings", async () => {
    const user = userEvent.setup();
    const homeRender = renderApp("/");
    await screen.findByRole("heading", {
      level: 2,
      name: "Proyectos seleccionados",
    });
    expect(screen.getByRole("heading", { level: 3, name: "LEM-BOX" })).toBeInTheDocument();

    homeRender.unmount();
    renderApp("/portfolio");
    const caseHeadings = await screen.findAllByRole("heading", { level: 2 });
    expect(caseHeadings).toHaveLength(8);
    const zentraHeading = screen.getByRole("heading", { level: 2, name: "ZENTRA" });
    const zentraCard = zentraHeading.closest("[id^='portfolio-case-']");
    if (!(zentraCard instanceof HTMLElement)) throw new Error("Missing ZENTRA card");

    await user.click(within(zentraCard).getByRole("button", { name: "Ver más: ZENTRA" }));
    expect(within(zentraCard).getByRole("heading", { level: 3, name: "Mi rol" })).toBeInTheDocument();
  });

  it("uses h2 for the LEM-BOX next-stage section", async () => {
    renderApp("/portfolio/lem-box");
    expect(
      await screen.findByRole("heading", { level: 2, name: "Siguiente etapa" }),
    ).toBeInTheDocument();
  });

  it("uses four independent 24px Hero buttons with 8px dots and no overlap", () => {
    renderApp("/");
    const group = screen.getByRole("group", { name: "Navegación de slides" });
    const buttons = within(group).getAllByRole("button");

    expect(group).toHaveClass("w-24", "self-center", "md:left-1/2", "md:-translate-x-1/2");
    expect(buttons).toHaveLength(4);
    expect(buttons.filter((button) => button.getAttribute("aria-pressed") === "true")).toHaveLength(1);
    expect(document.querySelector('[role="tablist"], [role="tab"]')).toBeNull();

    const leftEdges = buttons.map((button) => Number.parseFloat(button.style.left));
    expect(leftEdges).toEqual([0, 24, 48, 72]);
    for (const [index, button] of buttons.entries()) {
      expect(button).toHaveClass("h-6", "w-6");
      expect(button).not.toHaveAttribute("aria-controls");
      expect(button).not.toHaveAttribute("aria-selected");
      expect(button.firstElementChild).toHaveClass("h-2", "w-2");
      if (index > 0) {
        expect(leftEdges[index]).toBe((leftEdges[index - 1] ?? 0) + 24);
      }
    }
  });

  it("keeps unique Portfolio names, visible copy, focus and all eight cases", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    expect(document.querySelectorAll("[id^='portfolio-case-']")).toHaveLength(8);
    expect(
      screen.getByRole("link", {
        name: "Ver sitio web: Esteban Firpo · Miami Real Estate",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ver caso completo: LEM-BOX" }),
    ).toBeInTheDocument();

    const filter = screen.getByRole("button", { name: "Marca" });
    await user.click(filter);
    expect(filter).toHaveFocus();

    const zentraHeading = screen.getByRole("heading", { level: 2, name: "ZENTRA" });
    const card = zentraHeading.closest("[id^='portfolio-case-']");
    if (!(card instanceof HTMLElement)) throw new Error("Missing ZENTRA card");
    const expand = within(card).getByRole("button", { name: "Ver más: ZENTRA" });
    expect(expand).toHaveTextContent("Ver más");
    await user.click(expand);
    const collapse = within(card).getByRole("button", { name: "Ver menos: ZENTRA" });
    expect(collapse).toHaveFocus();
    expect(collapse).toHaveTextContent("Ver menos");
    await user.click(collapse);
    expect(within(card).getByRole("button", { name: "Ver más: ZENTRA" })).toHaveFocus();
  });

  it("localizes unique Portfolio names in English", async () => {
    renderApp("/en/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Some Work" });
    expect(screen.getByRole("button", { name: "View more: ZENTRA" })).toHaveTextContent(
      "View details",
    );
    expect(
      screen.getByRole("link", { name: "View full case study: LEM-BOX" }),
    ).toBeInTheDocument();
  });

  it("keeps decorative imagery silent and meaningful image names exact", async () => {
    const homeRender = renderApp("/");
    await screen.findByRole("heading", { level: 1 });
    expect(screen.getByRole("img", { name: "Rodrigo Opalo" })).toBeInTheDocument();

    for (const source of [
      "/img/hero-visual.jpg",
      "/img/hero-visual-mobile.jpg",
      "/img/impact.jpg",
      "/img/experience.jpg",
      "/img/servicios.jpg",
      "/img/certs/ibm-fullstack.png",
    ]) {
      expect(document.querySelector(`img[src="${source}"]`)).toHaveAttribute("alt", "");
    }

    homeRender.unmount();
    renderApp("/portfolio/lem-box");
    expect(
      await screen.findByRole("img", {
        name: "Logo de LEM-BOX con el lema «Logística en Miami»",
      }),
    ).toBeInTheDocument();
  });

});
