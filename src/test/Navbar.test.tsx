import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  LanguageProvider,
  RoutedLanguageProvider,
} from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

function renderNavbar({
  initialEntry = "/",
  language,
}: {
  initialEntry?: string;
  language?: Language;
} = {}) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LanguageProvider {...(language === undefined ? {} : { language })}>
        <Navbar />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}{location.search}{location.hash}
    </output>
  );
}

function renderRoutedNavbar(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <RoutedLanguageProvider>
        <Navbar />
        <LocationProbe />
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  expect(element).not.toBeNull();
  if (element === null) throw new Error(`Missing element: ${selector}`);
  return element;
}

describe("Navbar mobile menu", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it("opens with the approved ARIA relationship and removes the closed panel", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const trigger = await screen.findByRole("button", { name: "Abrir menú" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");
    expect(document.getElementById("mobile-navigation-panel")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", "mobile-navigation-panel");
    expect(document.getElementById("mobile-navigation-panel")).toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-navigation-panel")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const trigger = await screen.findByRole("button", { name: "Abrir menú" });

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-navigation-panel")).not.toBeInTheDocument();
  });

  it("closes after selecting a mobile link", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const trigger = await screen.findByRole("button", { name: "Abrir menú" });

    await user.click(trigger);
    const panel = document.getElementById("mobile-navigation-panel");
    expect(panel).toBeInTheDocument();
    if (!panel) throw new Error("Expected mobile navigation panel");

    await user.click(within(panel).getByRole("link", { name: "Sobre mí" }));

    expect(trigger).toHaveFocus();
    expect(document.getElementById("mobile-navigation-panel")).not.toBeInTheDocument();
  });

  it("closes after changing language", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const trigger = await screen.findByRole("button", { name: "Abrir menú" });

    await user.click(trigger);
    const panel = document.getElementById("mobile-navigation-panel");
    expect(panel).toBeInTheDocument();
    if (!panel) throw new Error("Expected mobile navigation panel");

    await user.click(within(panel).getByRole("button", { name: "Cambiar a inglés" }));

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName("Open menu");
    expect(document.getElementById("mobile-navigation-panel")).not.toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("en");
  });

  it.each([
    {
      language: "es",
      expectedLabels: [
        "Sobre mí",
        "Por qué elegirme",
        "Servicios",
        "Portfolio",
        "Contacto",
        "FAQ",
      ],
      servicesHref: "/servicios",
    },
    {
      language: "en",
      expectedLabels: [
        "About me",
        "Why choose me",
        "Services",
        "Portfolio",
        "Contact",
        "FAQ",
      ],
      servicesHref: "/en/services",
    },
  ] as const)(
    "keeps $language desktop, mobile, and no-JavaScript navigation in parity",
    async ({ language, expectedLabels, servicesHref }) => {
      const user = userEvent.setup();
      renderNavbar({ initialEntry: language === "es" ? "/" : "/en", language });

      const desktop = getRequiredElement<HTMLElement>("[data-navbar-desktop]");
      const trigger = screen.getByRole("button", {
        name: language === "es" ? "Abrir menú" : "Open menu",
      });
      const fallback = getRequiredElement<HTMLElement>("[data-nojs-mobile-nav]");
      const fallbackLinks = fallback.firstElementChild?.querySelectorAll("a");

      await user.click(trigger);

      const panel = getRequiredElement<HTMLElement>("#mobile-navigation-panel");
      const desktopLinks = [...desktop.children].filter(
        (element): element is HTMLAnchorElement =>
          element instanceof HTMLAnchorElement,
      );
      const mobileLinks = [...panel.children].filter(
        (element): element is HTMLAnchorElement =>
          element instanceof HTMLAnchorElement,
      );
      const noJavaScriptLinks = [...(fallbackLinks ?? [])];

      for (const links of [desktopLinks, mobileLinks, noJavaScriptLinks]) {
        expect(links.map((link) => link.textContent)).toEqual(expectedLabels);
        expect(links.filter((link) => link.getAttribute("href") === servicesHref))
          .toHaveLength(1);
      }
    },
  );
});

describe("Navbar color tokens", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it("uses the approved primary token for desktop hover and active language states", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const navigation = getRequiredElement<HTMLElement>("[data-navbar-desktop]");

    for (const label of ["Sobre mí", "Por qué elegirme", "Servicios", "Portfolio", "Contacto", "FAQ"]) {
      expect(within(navigation).getByRole("link", { name: label })).toHaveClass("hover:text-primary");
    }

    const spanishButton = within(navigation).getByRole("button", {
      name: "Idioma español seleccionado",
    });
    const englishButton = within(navigation).getByRole("button", {
      name: "Cambiar a inglés",
    });

    expect(spanishButton).toHaveClass("text-primary", "hover:text-primary");
    expect(englishButton).toHaveClass("text-white", "hover:text-primary");
    expect(navigation.innerHTML).not.toContain("blue-300");

    await user.click(englishButton);

    expect(spanishButton).toHaveClass("text-white", "hover:text-primary");
    expect(englishButton).toHaveClass("text-primary", "hover:text-primary");
  });

  it("keeps one approved translucent surface around the mobile panels", async () => {
    const user = userEvent.setup();
    renderNavbar();
    const navbar = getRequiredElement<HTMLElement>("nav[data-nojs-navbar]");
    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    const fallback = getRequiredElement<HTMLElement>("[data-nojs-mobile-nav]");

    expect(navbar).toHaveClass(
      "bg-black/70",
      "backdrop-blur-xl",
      "backdrop-saturate-150",
    );
    expect(fallback.parentElement).toBe(navbar);
    expect(fallback).not.toHaveClass("bg-black/90", "backdrop-blur-sm");

    await user.click(trigger);

    const panel = getRequiredElement<HTMLElement>("#mobile-navigation-panel");
    expect(panel.parentElement).toBe(navbar);
    expect(panel).not.toHaveClass("bg-black/90", "backdrop-blur-sm");
    expect(navbar.querySelectorAll('[class*="backdrop-blur"]')).toHaveLength(0);
  });
});

describe("Navbar no-JavaScript fallback", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it.each([
    {
      initialEntry: "/",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: ["/", "/en"],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/portfolio",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: ["/portfolio", "/en/portfolio"],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/portfolio/lem-box",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: [
        "/portfolio/lem-box",
        "/en/portfolio/lem-box",
      ],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/servicios",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: ["/servicios", "/en/services"],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/servicios/sitios-web-para-empresas",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: [
        "/servicios/sitios-web-para-empresas",
        "/en/services/business-websites",
      ],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/servicios/sistemas-a-medida",
      language: "es",
      navigationHrefs: [
        "/#sobremi",
        "/#porqueelegirnos",
        "/servicios",
        "/portfolio",
        "/#contacto",
        "/#faq",
      ],
      languageHrefs: [
        "/servicios/sistemas-a-medida",
        "/en/services/custom-software",
      ],
      currentLabel: "Español, idioma actual",
      navigationLabel: "Navegación principal",
      languageLabel: "Selector de idioma",
    },
    {
      initialEntry: "/en",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: ["/", "/en"],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
    {
      initialEntry: "/en/portfolio",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: ["/portfolio", "/en/portfolio"],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
    {
      initialEntry: "/en/portfolio/lem-box",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: [
        "/portfolio/lem-box",
        "/en/portfolio/lem-box",
      ],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
    {
      initialEntry: "/en/services",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: ["/servicios", "/en/services"],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
    {
      initialEntry: "/en/services/business-websites",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: [
        "/servicios/sitios-web-para-empresas",
        "/en/services/business-websites",
      ],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
    {
      initialEntry: "/en/services/custom-software",
      language: "en",
      navigationHrefs: [
        "/en#sobremi",
        "/en#porqueelegirnos",
        "/en/services",
        "/en/portfolio",
        "/en#contacto",
        "/en#faq",
      ],
      languageHrefs: [
        "/servicios/sistemas-a-medida",
        "/en/services/custom-software",
      ],
      currentLabel: "English, current language",
      navigationLabel: "Primary navigation",
      languageLabel: "Language selector",
    },
  ] as const)(
    "renders typed HTTP fallbacks for $initialEntry",
    ({
      initialEntry,
      language,
      navigationHrefs,
      languageHrefs,
      currentLabel,
      navigationLabel,
      languageLabel,
    }) => {
      renderNavbar({ initialEntry, language });

      const navigation = screen.getByRole("navigation", {
        name: navigationLabel,
      });
      const fallback = getRequiredElement<HTMLElement>("[data-nojs-mobile-nav]");
      const languageFallbacks = document.querySelectorAll<HTMLElement>(
        "[data-nojs-language]",
      );

      expect(document.querySelectorAll("nav")).toHaveLength(1);
      expect(navigation).toContainElement(fallback);
      expect(fallback).toHaveClass("hidden");
      expect(
        [...fallback.querySelectorAll<HTMLAnchorElement>("a")]
          .slice(0, navigationHrefs.length)
          .map((link) => link.getAttribute("href")),
      ).toEqual(navigationHrefs);
      expect(languageFallbacks).toHaveLength(2);

      for (const languageFallback of languageFallbacks) {
        expect(languageFallback).toHaveClass("hidden");
        expect(languageFallback).toHaveAttribute("role", "group");
        expect(languageFallback).toHaveAccessibleName(languageLabel);
        const links = [...languageFallback.querySelectorAll("a")];
        expect(links.map((link) => link.getAttribute("href"))).toEqual(
          languageHrefs,
        );
        expect(links.every((link) => link.hasAttribute("href"))).toBe(true);
        expect(links.filter((link) => link.getAttribute("aria-current") === "page"))
          .toHaveLength(1);
        expect(
          within(languageFallback).getByRole("link", { name: currentLabel }),
        ).toHaveAttribute("aria-current", "page");
      }

      expect(fallback.querySelector("button")).toBeNull();
      expect(fallback.querySelector("[aria-pressed]")).toBeNull();
      expect(fallback.querySelector('[tabindex]:not([tabindex="0"])')).toBeNull();
      for (const link of fallback.querySelectorAll("a")) {
        expect(link).toHaveClass("focus-visible:ring-2");
      }
    },
  );

  it("marks every JavaScript-only Navbar control for the noscript policy", () => {
    renderNavbar();

    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    const desktop = getRequiredElement<HTMLElement>("[data-navbar-desktop]");
    const desktopLanguageControls = within(desktop).getByRole("button", {
      name: "Idioma español seleccionado",
    }).parentElement;

    expect(trigger.parentElement).toHaveAttribute("data-nojs-hide");
    expect(desktopLanguageControls).toHaveAttribute("data-nojs-hide");
    expect(document.querySelector("[data-nojs-navbar]")).toBe(
      screen.getByRole("navigation", { name: "Navegación principal" }),
    );
  });

  it("keeps the active selector query and hash behavior unchanged", async () => {
    const user = userEvent.setup();
    renderRoutedNavbar("/portfolio?source=close02d2#portfolio-grid");

    await user.click(
      screen.getByRole("button", { name: "Cambiar a inglés" }),
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/en/portfolio?source=close02d2#portfolio-grid",
    );
  });
});
