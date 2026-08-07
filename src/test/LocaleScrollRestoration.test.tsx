import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";
import {
  captureLocaleScrollContext,
  isLocaleSwitchNavigationState,
  restoreLocaleScrollContext,
} from "../lib/localeScroll";

type SectionRect = { top: number; height: number };

type GeometryOptions = {
  sections?: Record<string, SectionRect>;
  navbarHeight?: number;
  innerHeight?: number;
  scrollY?: number;
  scrollHeight?: number;
};

function mockGeometry({
  sections = {},
  navbarHeight = 60,
  innerHeight = 800,
  scrollY = 0,
  scrollHeight = 5000,
}: GeometryOptions) {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const empty: DOMRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };

      if (this.matches("[data-nojs-navbar]")) {
        return { ...empty, bottom: navbarHeight, height: navbarHeight };
      }
      const section = this.id ? sections[this.id] : undefined;
      if (section !== undefined) {
        return {
          ...empty,
          bottom: section.top + section.height,
          height: section.height,
          top: section.top,
        };
      }
      return empty;
    },
  );
}

/** Standalone unit tests exercise localeScroll.ts against a bare document, so
 * the navbar and section ids it queries for must exist first. */
function mockGeometryWithFixture(options: GeometryOptions) {
  const fixture = document.createElement("div");
  fixture.setAttribute("data-locale-scroll-fixture", "true");

  const navbar = document.createElement("nav");
  navbar.setAttribute("data-nojs-navbar", "true");
  fixture.appendChild(navbar);

  for (const id of Object.keys(options.sections ?? {})) {
    const section = document.createElement("div");
    section.id = id;
    fixture.appendChild(section);
  }

  document.body.appendChild(fixture);
  mockGeometry(options);
}

/** window.scrollTo is a single shared vi.fn() installed once in test/setup.ts;
 * vi.spyOn returns that same instance instead of wrapping it, so its call
 * history must be cleared explicitly before each assertion, not restored. */
function getScrollToSpy() {
  const spy = window.scrollTo as unknown as ReturnType<typeof vi.fn>;
  spy.mockClear();
  return spy;
}

function renderApp(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <RoutedLanguageProvider>
        <App />
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

describe("localeScroll — capture/restore contract", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document
      .querySelectorAll("[data-locale-scroll-fixture]")
      .forEach((node) => node.remove());
  });

  it("marks top-anchored scroll positions and skips section lookup", () => {
    mockGeometryWithFixture({ scrollY: 10, navbarHeight: 60 });
    const context = captureLocaleScrollContext("home");
    expect(context).toEqual({
      pageRatio: expect.any(Number),
      sectionKey: null,
      sectionProgress: null,
      topAnchor: true,
    });
  });

  it("captures the section centered in the viewport and a relative progress", () => {
    mockGeometryWithFixture({
      navbarHeight: 60,
      innerHeight: 800,
      scrollY: 2000,
      sections: {
        hero: { top: -3000, height: 900 },
        sobremi: { top: -900, height: 400 },
        portfolio: { top: -100, height: 1600 },
        contacto: { top: 1500, height: 500 },
        faq: { top: 2000, height: 400 },
      },
    });

    const context = captureLocaleScrollContext("home");
    expect(context.topAnchor).toBe(false);
    expect(context.sectionKey).toBe("portfolio");
    expect(context.sectionProgress).toBeGreaterThan(0);
    expect(context.sectionProgress).toBeLessThan(1);
  });

  it("falls back to the page ratio when no section id is present on the page", () => {
    mockGeometryWithFixture({ scrollY: 900, innerHeight: 800, scrollHeight: 5000 });
    const context = captureLocaleScrollContext("portfolio");
    expect(context.sectionKey).toBeNull();
    expect(context.sectionProgress).toBeNull();
    expect(context.pageRatio).toBeCloseTo(900 / (5000 - 800), 5);
  });

  it("restores by aligning the same section id at the captured progress", () => {
    mockGeometryWithFixture({
      navbarHeight: 60,
      innerHeight: 800,
      sections: { faq: { top: 200, height: 400 } },
    });
    const scrollToSpy = getScrollToSpy();

    restoreLocaleScrollContext({
      pageRatio: 0.5,
      sectionKey: "faq",
      sectionProgress: 0.25,
      topAnchor: false,
    });

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    const [call] = scrollToSpy.mock.calls[0] as [ScrollToOptions];
    expect(call.left).toBe(0);
    // navbarHeight 60, innerHeight 800 -> viewportCenter 430; faq top 200 + 0.25*400 = 300
    expect(call.top).toBe(300 - 430);
  });

  it("does nothing when the captured context is top-anchored", () => {
    mockGeometryWithFixture({});
    const scrollToSpy = getScrollToSpy();

    restoreLocaleScrollContext({
      pageRatio: 0,
      sectionKey: null,
      sectionProgress: null,
      topAnchor: true,
    });

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("recognizes only well-formed locale-switch navigation state", () => {
    expect(isLocaleSwitchNavigationState(undefined)).toBe(false);
    expect(isLocaleSwitchNavigationState(null)).toBe(false);
    expect(isLocaleSwitchNavigationState({})).toBe(false);
    expect(isLocaleSwitchNavigationState({ localeSwitch: true })).toBe(false);
    expect(
      isLocaleSwitchNavigationState({
        localeSwitch: true,
        scrollContext: {
          pageRatio: 0,
          sectionKey: null,
          sectionProgress: null,
          topAnchor: true,
        },
      }),
    ).toBe(true);
  });
});

describe("language switch — scroll and focus integration", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not reset scroll to top when switching language mid-page (regression guard for the reported bug)", async () => {
    mockGeometry({
      navbarHeight: 60,
      innerHeight: 800,
      scrollY: 2000,
      sections: {
        hero: { top: -3000, height: 900 },
        sobremi: { top: -900, height: 400 },
        portfolio: { top: -100, height: 1600 },
        contacto: { top: 1500, height: 500 },
        faq: { top: 2000, height: 400 },
      },
    });
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 1, name: "Algunos trabajos" });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "Some Work" });

    await waitFor(() => {
      const topCalls = scrollToSpy.mock.calls.filter(
        (call) => (call[0] as ScrollToOptions)?.top === 0,
      );
      expect(topCalls).toHaveLength(0);
    });
  });

  it("stays at the top when the user was already at the top before switching", async () => {
    mockGeometry({ scrollY: 0, navbarHeight: 60 });
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

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("still scrolls to top for a normal Navbar navigation (not a locale switch)", async () => {
    mockGeometry({
      navbarHeight: 60,
      innerHeight: 800,
      scrollY: 2000,
      sections: { portfolio: { top: -100, height: 1600 } },
    });
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/servicios");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web, sistemas y automatización para empresas.",
    });

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

  it("prioritizes an existing hash target over section-relative restoration", async () => {
    mockGeometry({
      navbarHeight: 60,
      innerHeight: 800,
      sections: { contacto: { top: 100, height: 400 } },
    });
    const scrollToSpy = getScrollToSpy();
    const user = userEvent.setup();
    renderApp("/#contacto");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", {
      level: 1,
      name: "Websites built to communicate and convert.",
    });

    const contactSection = document.getElementById("contacto");
    expect(contactSection).not.toBeNull();
    await waitFor(() => {
      expect(contactSection?.scrollIntoView).toHaveBeenCalled();
    });
    expect(
      scrollToSpy.mock.calls.some((call) => (call[0] as ScrollToOptions)?.top === 0),
    ).toBe(false);
  });

  it("closes the mobile menu on a mobile language switch", async () => {
    mockGeometry({ scrollY: 0, navbarHeight: 60 });
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    const mobilePanel = document.getElementById("mobile-navigation-panel");
    expect(mobilePanel).not.toBeNull();
    if (mobilePanel === null) throw new Error("Missing mobile navigation panel");

    await user.click(
      within(mobilePanel).getByRole("button", { name: "Cambiar a inglés" }),
    );

    await waitFor(() => {
      expect(document.getElementById("mobile-navigation-panel")).toBeNull();
    });
  });
});

describe("language switch — head reconciliation", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it("synchronizes html lang, title, canonical and hreflang immediately on switch, with no duplicates", async () => {
    mockGeometry({ scrollY: 0, navbarHeight: 60 });
    const user = userEvent.setup();
    renderApp("/portfolio/lem-box");
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("es");
      expect(document.title).toBe(
        "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
      );
    });

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("en");
      expect(document.title).toBe(
        "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
      );
      expect(
        document.head.querySelector('link[rel="canonical"]'),
      ).toHaveAttribute(
        "href",
        "https://www.devrodri.com/en/portfolio/lem-box",
      );
      expect(
        document.head.querySelector('meta[property="og:locale"]'),
      ).toHaveAttribute("content", "en_US");
    });

    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(
      document.head.querySelectorAll('link[rel="canonical"]'),
    ).toHaveLength(1);
    expect(
      document.head.querySelectorAll('link[rel="alternate"]'),
    ).toHaveLength(3);
    expect(
      document.head.querySelectorAll('script[type="application/ld+json"]'),
    ).toHaveLength(1);
  });
});
