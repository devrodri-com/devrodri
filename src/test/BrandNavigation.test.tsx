import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";
import { isLocaleSwitchNavigationState } from "../lib/localeScroll";

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="loc">
      {location.pathname}
      {location.search}
      {location.hash}|{location.key}|{JSON.stringify(location.state)}
    </output>
  );
}

function GoBackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      test-go-back
    </button>
  );
}

function renderApp(entry: string, { withGoBack = false } = {}) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <RoutedLanguageProvider>
        <App />
        <LocationProbe />
        {withGoBack ? <GoBackButton /> : null}
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

function getScrollToSpy() {
  const spy = window.scrollTo as unknown as ReturnType<typeof vi.fn>;
  spy.mockClear();
  return spy;
}

describe("brand navigation — DevRodri link", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("1. points to / in Spanish", async () => {
    renderApp("/portfolio");
    const brand = await screen.findByRole("link", { name: "DEVRODRI - Inicio" });
    expect(brand.tagName).toBe("A");
    expect(brand).toHaveAttribute("href", "/");
  });

  it("2. points to /en in English", async () => {
    renderApp("/en/portfolio");
    const brand = await screen.findByRole("link", { name: "DEVRODRI - Home" });
    expect(brand.tagName).toBe("A");
    expect(brand).toHaveAttribute("href", "/en");
  });

  it("3. clicking from a scrolled Home scrolls back to top without navigating", async () => {
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    const locBefore = screen.getByTestId("loc").textContent;
    scrollToSpy.mockClear();

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 0, top: 0 }),
      );
    });
    expect(screen.getByTestId("loc").textContent).toBe(locBefore);
  });

  it("4. clicking from another route navigates to Home and scrolls to top", async () => {
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });
    scrollToSpy.mockClear();

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    expect(screen.getByTestId("loc").textContent).toMatch(/^\/\|/);
    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 0, top: 0 }),
      );
    });
  });

  it("5. clicking from an English route keeps English and lands on /en", async () => {
    const user = userEvent.setup();
    renderApp("/en/services");
    await screen.findByRole("heading", {
      level: 1,
      name: "Websites, custom systems, and automation for businesses.",
    });

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Home" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Websites built to communicate and convert.",
    });
    expect(screen.getByTestId("loc").textContent).toMatch(/^\/en\|/);
  });

  it("6. drops query and hash from another route when landing on Home", async () => {
    const user = userEvent.setup();
    renderApp("/servicios?ref=campaign#services-directory");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web, sistemas y automatización para empresas.",
    });

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    expect(screen.getByTestId("loc").textContent).toMatch(/^\/\|/);
  });

  it("7. does not create a duplicate history entry from the same clean Home", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    const keyBefore = screen.getByTestId("loc").textContent?.split("|")[1];

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    const keyAfter = screen.getByTestId("loc").textContent?.split("|")[1];
    expect(keyAfter).toBe(keyBefore);
  });

  it("8. does not re-trigger a pathname transition from the same clean Home (no duplicate pageview)", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    const pathnameBefore = screen.getByTestId("loc").textContent?.split("|")[0];

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));
    await new Promise((resolve) => setTimeout(resolve, 20));

    const pathnameAfter = screen.getByTestId("loc").textContent?.split("|")[0];
    expect(pathnameAfter).toBe(pathnameBefore);
  });

  it("9. produces exactly one pathname transition when navigating from another route", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    expect(screen.getByTestId("loc").textContent).toMatch(/^\/\|/);
  });

  it("10. closes the mobile menu on a brand click", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    expect(document.getElementById("mobile-navigation-panel")).not.toBeNull();

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await waitFor(() => {
      expect(document.getElementById("mobile-navigation-panel")).toBeNull();
    });
  });

  it("11. never marks a brand navigation as a locale switch", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    const stateJson = screen.getByTestId("loc").textContent?.split("|")[2];
    expect(isLocaleSwitchNavigationState(JSON.parse(stateJson ?? "null"))).toBe(
      false,
    );
  });

  it("12. a pending locale-switch scroll snapshot is not consumed by a following brand click", async () => {
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "Some Work" });
    scrollToSpy.mockClear();

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Home" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Websites built to communicate and convert.",
    });
    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 0, top: 0 }),
      );
    });
  });

  it("14. still preserves the FAQ section across a locale switch", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const empty = {
          bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
          toJSON: () => ({}),
        } as DOMRect;
        if (this.matches("[data-nojs-navbar]")) {
          return { ...empty, bottom: 60, height: 60 };
        }
        if (this.id === "faq") {
          return { ...empty, bottom: 2400, height: 400, top: 2000 };
        }
        return empty;
      },
    );
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 2100 });

    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Websites built to communicate and convert.",
    });

    await waitFor(() => {
      const topCalls = scrollToSpy.mock.calls.filter(
        (call) => (call[0] as ScrollToOptions)?.top === 0,
      );
      expect(topCalls).toHaveLength(0);
    });
  });

  it("15. still preserves the Services hub section across a locale switch", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const empty = {
          bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
          toJSON: () => ({}),
        } as DOMRect;
        if (this.matches("[data-nojs-navbar]")) {
          return { ...empty, bottom: 60, height: 60 };
        }
        if (this.id === "services-coverage") {
          return { ...empty, bottom: 2400, height: 400, top: 2000 };
        }
        return empty;
      },
    );
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 2100 });

    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/servicios");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web, sistemas y automatización para empresas.",
    });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Websites, custom systems, and automation for businesses.",
    });

    await waitFor(() => {
      const topCalls = scrollToSpy.mock.calls.filter(
        (call) => (call[0] as ScrollToOptions)?.top === 0,
      );
      expect(topCalls).toHaveLength(0);
    });
  });

  it("16. still preserves the LEM-BOX ecosystem section across a locale switch", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const empty = {
          bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
          toJSON: () => ({}),
        } as DOMRect;
        if (this.matches("[data-nojs-navbar]")) {
          return { ...empty, bottom: 60, height: 60 };
        }
        if (this.id === "lem-box-ecosystem") {
          return { ...empty, bottom: 2400, height: 400, top: 2000 };
        }
        return empty;
      },
    );
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 2100 });

    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/portfolio/lem-box");
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    await waitFor(() => {
      const topCalls = scrollToSpy.mock.calls.filter(
        (call) => (call[0] as ScrollToOptions)?.top === 0,
      );
      expect(topCalls).toHaveLength(0);
    });
  });

  it("17. a normal Navbar navigation still scrolls to top", async () => {
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    scrollToSpy.mockClear();

    const desktopNavigation = document.querySelector<HTMLElement>(
      "[data-navbar-desktop]",
    );
    if (desktopNavigation === null) throw new Error("Missing desktop Navbar");
    await user.click(within(desktopNavigation).getByRole("link", { name: "Portfolio" }));
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await waitFor(() => {
      expect(scrollToSpy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 0, top: 0 }),
      );
    });
  });

  it("18. keeps the brand link a real anchor for no-JS navigation", async () => {
    renderApp("/portfolio");
    const brand = await screen.findByRole("link", { name: "DEVRODRI - Inicio" });
    expect(brand.tagName).toBe("A");
    expect(brand).toHaveAttribute("href", "/");
    expect(brand.closest("a")).toBe(brand);
    expect(brand.querySelector("a")).toBeNull();
  });

  it("19. does not replay a stale scroll restoration on Back navigation", async () => {
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/portfolio", { withGoBack: true });
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("link", { name: "DEVRODRI - Inicio" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });
    scrollToSpy.mockClear();

    await user.click(screen.getByRole("button", { name: "test-go-back" }));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(
      scrollToSpy.mock.calls.some((call) => (call[0] as ScrollToOptions)?.top === 0),
    ).toBe(false);
  });
});
