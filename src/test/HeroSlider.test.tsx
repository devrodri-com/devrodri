import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HeroSlider from "../Components/HeroSlider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

const expectedCopy = {
  es: [
    {
      claim: "RODRIGO OPALO · DESARROLLO FULL-STACK",
      mobileEyebrow: "RODRIGO OPALO · FULL-STACK",
      title: "Sitios web que comunican y convierten.",
      description:
        "Diseño y desarrollo experiencias digitales claras, rápidas y orientadas a objetivos reales de negocio.",
      button: "Ver trabajos",
    },
    {
      claim: "SISTEMAS · PORTALES · HERRAMIENTAS INTERNAS",
      mobileEyebrow: "SISTEMAS · PORTALES",
      title: "Software a medida para operar mejor.",
      description:
        "Construyo plataformas alineadas con los procesos reales de cada negocio y preparadas para crecer.",
      button: "Ver LEM-BOX",
    },
    {
      claim:
        "ESTRATEGIA DE MARCA · DIRECCIÓN CREATIVA · LANZAMIENTO DIGITAL",
      mobileEyebrow: "MARCA · DIRECCIÓN CREATIVA",
      title: "Marcas con dirección y presencia digital.",
      description:
        "Defino la estrategia y coordino la identidad, la infraestructura y la web para lanzar una marca con coherencia.",
      button: "Ver ZENTRA",
    },
    {
      claim: "AUTOMATIZACIONES · INTEGRACIONES · IA APLICADA",
      mobileEyebrow: "AUTOMATIZACIÓN · INTEGRACIONES",
      title: "Menos tareas manuales. Más tiempo para crecer.",
      description:
        "Conecto herramientas, APIs y flujos para reducir trabajo repetitivo y mejorar la operación.",
      button: "Contame tu proceso",
    },
  ],
  en: [
    {
      claim: "RODRIGO OPALO · FULL-STACK DEVELOPMENT",
      mobileEyebrow: "RODRIGO OPALO · FULL-STACK",
      title: "Websites built to communicate and convert.",
      description:
        "I design and develop clear, fast digital experiences aligned with real business goals.",
      button: "View work",
    },
    {
      claim: "CUSTOM SYSTEMS · PORTALS · INTERNAL TOOLS",
      mobileEyebrow: "SYSTEMS · PORTALS",
      title: "Custom software for better operations.",
      description:
        "I build platforms around real business processes, designed to evolve and grow.",
      button: "View LEM-BOX",
    },
    {
      claim: "BRAND STRATEGY · CREATIVE DIRECTION · DIGITAL LAUNCH",
      mobileEyebrow: "BRAND · CREATIVE DIRECTION",
      title: "Brands with direction and a strong digital presence.",
      description:
        "I shape the strategy and coordinate identity, infrastructure, and web development to launch a coherent brand.",
      button: "View ZENTRA",
    },
    {
      claim: "AUTOMATION · INTEGRATIONS · APPLIED AI",
      mobileEyebrow: "AUTOMATION · INTEGRATIONS",
      title: "Less manual work. More time to grow.",
      description:
        "I connect tools, APIs, and workflows to reduce repetitive tasks and improve operations.",
      button: "Tell me about your process",
    },
  ],
} as const satisfies Record<
  Language,
  readonly {
    claim: string;
    mobileEyebrow: string;
    title: string;
    description: string;
    button: string;
  }[]
>;

function renderHero(language: Language = "es") {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <HeroSlider />
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe("HeroSlider resilience", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it.each(["es", "en"] as const)(
    "uses the exact approved %s copy in slide order",
    async (language) => {
      const user = userEvent.setup();
      renderHero(language);
      const tabs = screen.getAllByRole("tab");

      expect(tabs).toHaveLength(4);
      for (const [index, copy] of expectedCopy[language].entries()) {
        await user.click(tabs[index] as HTMLElement);
        expect(
          screen.getByRole("heading", { level: 1, name: copy.title }),
        ).toBeInTheDocument();
        expect(screen.getByText(copy.claim)).toBeInTheDocument();
        expect(screen.getByText(copy.mobileEyebrow)).toBeInTheDocument();
        expect(screen.getByText(copy.description)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: copy.button })).toBeInTheDocument();
      }
    },
  );

  it("contains no agency plurals, long dashes, or object coercion in the new copy", () => {
    const { container } = renderHero();
    const copy = JSON.stringify(expectedCopy);

    expect(copy).not.toMatch(
      /\b(desarrollamos|creamos|hacemos|somos|nuestro equipo|we build|we create|our team)\b/i,
    );
    expect(copy).not.toMatch(/[—–]/);
    expect(container.textContent).not.toContain("[object Object]");
    expect(copy).not.toContain("[object Object]");
  });

  it("keeps the approved CTA destinations", async () => {
    const user = userEvent.setup();
    renderHero();
    const tabs = screen.getAllByRole("tab");
    const destinations = [
      { button: "Ver trabajos", href: "/portfolio" },
      { button: "Ver LEM-BOX", href: "/portfolio" },
      { button: "Ver ZENTRA", href: "/portfolio" },
      { button: "Contame tu proceso", href: "#contacto" },
    ] as const;

    for (const [index, destination] of destinations.entries()) {
      await user.click(tabs[index] as HTMLElement);
      expect(screen.getByRole("link", { name: destination.button })).toHaveAttribute(
        "href",
        destination.href,
      );
    }
  });

  it("keeps asset order and uses the approved split mobile image treatment", async () => {
    const user = userEvent.setup();
    const { container } = renderHero();
    const tabs = screen.getAllByRole("tab");
    const expectedAssets = [
      {
        alt: "Man working on web design project on laptop",
        desktop: "/img/hero-visual.jpg",
        mobile: "/img/hero-visual-mobile.jpg",
        mobilePosition: "center 46%",
      },
      {
        alt: "Dashboard of a custom software with charts and code",
        desktop: "/img/software-slide.jpg",
        mobile: "/img/software-slide-mobile.jpg",
        mobilePosition: "center 44%",
      },
      {
        alt: "Brand strategy and color palette design on tablet",
        desktop: "/img/branding-slide.jpg",
        mobile: "/img/branding-slide-mobile.jpg",
        mobilePosition: "center 50%",
      },
      {
        alt: "Automation workflows dashboard",
        desktop: "/img/automations-slide.jpg",
        mobile: "/img/automations-slide-mobile.jpg",
        mobilePosition: "center 48%",
      },
    ] as const;

    for (const [index, asset] of expectedAssets.entries()) {
      await user.click(tabs[index] as HTMLElement);
      const images = await waitFor(() => screen.getAllByAltText(asset.alt));
      expect(images).toHaveLength(2);
      expect(images.map((image) => image.getAttribute("src")).sort()).toEqual(
        [asset.desktop, asset.mobile].sort(),
      );

      const mobileImage = images.find(
        (image) => image.getAttribute("src") === asset.mobile,
      );
      expect(mobileImage).toHaveClass("object-cover");
      expect(mobileImage).toHaveStyle({
        objectPosition: asset.mobilePosition,
      });
      expect(mobileImage?.nextElementSibling).toHaveClass(
        "h-12",
        "bg-gradient-to-b",
        "from-transparent",
        "to-black",
      );
    }

    const mobileLayer = container.querySelector(".md\\:hidden");
    const desktopLayer = container.querySelector(".md\\:block");
    expect(mobileLayer).toBeInTheDocument();
    expect(mobileLayer).toHaveClass(
      "top-[3.3125rem]",
      "h-[clamp(18rem,38svh,21rem)]",
    );
    expect(mobileLayer?.lastElementChild).toHaveClass("bg-gradient-to-b");
    expect(desktopLayer?.querySelector("img")).toHaveClass("object-center");
  });

  it.each(["es", "en"] as const)(
    "keeps accessible slide names aligned with the %s titles",
    (language) => {
      renderHero(language);

      expect(
        screen
          .getAllByRole("tab")
          .map((tab) => tab.getAttribute("aria-label")),
      ).toEqual(
        expectedCopy[language].map(({ title }, index) =>
          language === "es"
            ? `Ir al slide ${index + 1} de 4: ${title}`
            : `Go to slide ${index + 1} of 4: ${title}`,
        ),
      );
    },
  );

  it("separates mobile image and content without a card or text shadow", () => {
    const { container } = renderHero();
    const hero = container.querySelector("#hero");
    const heading = screen.getByRole("heading", { level: 1 });
    const copyColumn = heading.parentElement;

    expect(hero).toHaveClass("overflow-hidden");
    expect(copyColumn?.parentElement).toHaveClass(
      "min-h-[100svh]",
      "pt-[calc(3.3125rem+clamp(18rem,38svh,21rem))]",
      "xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]",
    );
    expect(heading).toHaveClass(
      "max-md:text-[2.5rem]",
      "max-md:leading-[1.05]",
      "sm:text-5xl",
    );
    expect(heading.className).not.toContain("drop-shadow");
    expect(copyColumn?.className).not.toMatch(/\b(bg-|backdrop-blur)/);
  });

  it("keeps approved slide navigation working", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByRole("button", { name: "Slide siguiente" }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Software a medida para operar mejor.",
      }),
    ).toBeInTheDocument();
  });

  it("keeps navigation available when reduced motion is preferred", async () => {
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
    renderHero();

    await user.click(
      screen.getByRole("tab", {
        name: "Ir al slide 3 de 4: Marcas con dirección y presencia digital.",
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Marcas con dirección y presencia digital.",
      }),
    ).toBeInTheDocument();
  });

  it("ignores touch events without an indexed touch", () => {
    const { container } = renderHero();
    const hero = container.querySelector("#hero");
    if (!(hero instanceof HTMLElement)) {
      throw new Error("Expected the Hero section");
    }

    expect(() => fireEvent.touchStart(hero, { touches: [] })).not.toThrow();
    fireEvent.touchStart(hero, { touches: [{ clientX: 100 }] });
    expect(() =>
      fireEvent.touchEnd(hero, { changedTouches: [] }),
    ).not.toThrow();
  });

  it("preserves touch navigation", () => {
    const { container } = renderHero();
    const hero = container.querySelector("#hero");
    if (!(hero instanceof HTMLElement)) {
      throw new Error("Expected the Hero section");
    }

    fireEvent.touchStart(hero, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(hero, { changedTouches: [{ clientX: 50 }] });

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Software a medida para operar mejor.",
      }),
    ).toBeInTheDocument();
  });

  it("preserves horizontal wheel navigation and preventDefault", () => {
    vi.useFakeTimers();
    const rendered = renderHero();
    const hero = rendered.container.querySelector("#hero");
    if (!(hero instanceof HTMLElement)) {
      throw new Error("Expected the Hero section");
    }
    const wheelEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaX: 30,
      deltaY: 0,
    });

    act(() => {
      hero.dispatchEvent(wheelEvent);
      vi.advanceTimersByTime(15);
    });

    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Software a medida para operar mejor.",
      }),
    ).toBeInTheDocument();
    rendered.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clears active transition timers when unmounted", () => {
    vi.useFakeTimers();
    const rendered = renderHero();

    fireEvent.click(screen.getByRole("button", { name: "Slide siguiente" }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    rendered.unmount();
    act(() => {
      vi.runAllTimers();
    });

    expect(vi.getTimerCount()).toBe(0);
  });
});
