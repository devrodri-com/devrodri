import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HeroSlider from "../Components/HeroSlider";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";
import heroSliderSource from "../Components/HeroSlider.tsx?raw";

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

function getSlideButtons(language: Language = "es") {
  return within(
    screen.getByRole("group", {
      name: language === "es" ? "Navegación de slides" : "Slide navigation",
    }),
  ).getAllByRole("button");
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
      const tabs = getSlideButtons(language);

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
    const tabs = getSlideButtons();
    const destinations = [
      { button: "Ver trabajos", href: "/portfolio" },
      { button: "Ver LEM-BOX", href: "/portfolio/lem-box" },
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

  it("uses one responsive picture per active slide with the approved compositions", async () => {
    const user = userEvent.setup();
    const { container } = renderHero();
    const tabs = getSlideButtons();
    const expectedAssets = [
      {
        desktop: "/img/hero-visual.jpg",
        desktopWidth: "1536",
        desktopHeight: "1024",
        mobile: "/img/hero-visual-mobile.jpg",
        mobileWidth: "1000",
        mobileHeight: "1384",
        mobilePosition: "center 46%",
      },
      {
        desktop: "/img/software-slide.jpg",
        desktopWidth: "1536",
        desktopHeight: "1024",
        mobile: "/img/software-slide-mobile.jpg",
        mobileWidth: "1024",
        mobileHeight: "1536",
        mobilePosition: "center 44%",
      },
      {
        desktop: "/img/branding-slide.jpg",
        desktopWidth: "1536",
        desktopHeight: "1024",
        mobile: "/img/branding-slide-mobile.jpg",
        mobileWidth: "1024",
        mobileHeight: "1536",
        mobilePosition: "center 50%",
      },
      {
        desktop: "/img/automations-slide.jpg",
        desktopWidth: "1536",
        desktopHeight: "1024",
        mobile: "/img/automations-slide-mobile.jpg",
        mobileWidth: "1024",
        mobileHeight: "1536",
        mobilePosition: "center 48%",
      },
    ] as const;

    for (const [index, asset] of expectedAssets.entries()) {
      await user.click(tabs[index] as HTMLElement);
      const picture = await waitFor(() => {
        const activePicture = container.querySelector("picture");
        expect(activePicture?.querySelector("img")).toHaveAttribute(
          "src",
          asset.desktop,
        );
        return activePicture;
      });
      if (!(picture instanceof HTMLPictureElement)) {
        throw new Error("Expected one active Hero picture");
      }
      const source = picture.querySelector("source");
      const image = picture.querySelector("img");

      expect(container.querySelectorAll("picture")).toHaveLength(1);
      expect(picture.querySelectorAll("img")).toHaveLength(1);
      expect(source).toHaveAttribute("media", "(max-width: 767px)");
      expect(source).toHaveAttribute("srcset", asset.mobile);
      expect(source).toHaveAttribute("width", asset.mobileWidth);
      expect(source).toHaveAttribute("height", asset.mobileHeight);
      expect(image).toHaveAttribute("src", asset.desktop);
      expect(image).toHaveAttribute("width", asset.desktopWidth);
      expect(image).toHaveAttribute("height", asset.desktopHeight);
      expect(image).toHaveAttribute("alt", "");
      expect(image).toHaveClass(
        "object-cover",
        "[object-position:var(--hero-mobile-object-position)]",
        "md:object-center",
      );
      expect(picture.parentElement).toHaveStyle({
        "--hero-mobile-object-position": asset.mobilePosition,
      });
      expect(picture.nextElementSibling).toHaveClass(
        "h-12",
        "bg-gradient-to-b",
        "from-transparent",
        "to-black",
        "md:hidden",
      );

      if (index === 0) {
        expect(image).toHaveAttribute("fetchpriority", "high");
      } else {
        expect(image).not.toHaveAttribute("fetchpriority");
      }
    }

    const imageLayer = container.querySelector("picture")?.parentElement;
    expect(imageLayer).toHaveClass(
      "top-[3.3125rem]",
      "h-[clamp(18rem,38svh,21rem)]",
      "md:inset-y-0",
      "md:left-auto",
      "md:h-auto",
      "md:w-1/2",
    );
    expect(imageLayer?.querySelectorAll(".bg-gradient-to-r")).toHaveLength(2);
  });

  it("keeps the approved Hero motion inventory with no initial=false override", () => {
    expect(heroSliderSource.match(/<AnimatePresence\b/g) ?? []).toHaveLength(1);
    expect(heroSliderSource).toContain('<AnimatePresence mode="wait">');
    expect(heroSliderSource.match(/<motion\.div\b/g) ?? []).toHaveLength(1);
    expect(heroSliderSource).toContain("key={currentSlide.id}");
    expect(heroSliderSource).toContain("initial={{ opacity: 0, x: 100 }}");
    expect(heroSliderSource).toContain("animate={{ opacity: 1, x: 0 }}");
    expect(heroSliderSource).toContain("exit={{ opacity: 0, x: -100 }}");
    expect(heroSliderSource).toContain(
      'transition={{ duration: 0.5, ease: "easeInOut" }}',
    );
    expect(heroSliderSource).not.toContain("initial={false}");
    expect(heroSliderSource).not.toContain("whileInView");
    expect(heroSliderSource).not.toContain("viewport=");
    expect(heroSliderSource).not.toContain("whileHover");
    expect(heroSliderSource).not.toContain("whileTap");
    expect(heroSliderSource).not.toContain("MotionConfig");
  });

  it.each(["es", "en"] as const)(
    "keeps accessible slide names aligned with the %s titles",
    (language) => {
      renderHero(language);

      expect(
        getSlideButtons(language).map((tab) =>
          tab.getAttribute("aria-label"),
        ),
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
      "max-md:pb-[max(1.5rem,env(safe-area-inset-bottom))]",
      "xl:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]",
    );
    expect(heading).toHaveClass(
      "max-md:flex",
      "max-md:min-h-[10.5rem]",
      "max-md:items-center",
      "max-md:text-[2.5rem]",
      "max-md:leading-[1.05]",
      "sm:text-5xl",
    );
    expect(heading.nextElementSibling).toHaveClass(
      "max-md:flex",
      "max-md:min-h-[6.75rem]",
      "max-md:items-center",
      "min-[420px]:max-md:min-h-[5.0625rem]",
    );
    expect(copyColumn).not.toHaveClass("max-md:min-h-[24.25rem]");
    expect(copyColumn?.querySelector(".w-fit")).not.toHaveClass("max-md:mt-auto");
    expect(
      screen.getByRole("group", { name: "Navegación de slides" }),
    ).toHaveClass(
      "relative",
      "h-2",
      "w-24",
      "mt-[2.625rem]",
      "self-center",
      "md:absolute",
      "md:bottom-6",
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
      screen.getByRole("button", {
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
