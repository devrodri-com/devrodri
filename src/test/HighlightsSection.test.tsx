import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HighlightsSection from "../Components/HighlightsSection";
import { LanguageProvider } from "../i18n/LanguageProvider";

let intersectionCallback: IntersectionObserverCallback | undefined;

const callbackObserver: IntersectionObserver = {
  root: null,
  rootMargin: "0px",
  thresholds: [0.25],
  disconnect() {},
  observe() {},
  takeRecords() {
    return [];
  },
  unobserve() {},
};

class ControlledIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0.25];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

function renderHighlights() {
  return render(
    <LanguageProvider>
      <HighlightsSection />
    </LanguageProvider>,
  );
}

function getBackgroundVideo(container: HTMLElement): HTMLVideoElement {
  const video = container.querySelector("video");
  if (!(video instanceof HTMLVideoElement)) {
    throw new Error("Expected the Highlights background video");
  }
  return video;
}

function getHighlightsSection(container: HTMLElement): HTMLElement {
  const section = container.querySelector("#porqueelegirnos");
  if (!(section instanceof HTMLElement)) {
    throw new Error("Expected the Highlights section");
  }
  return section;
}

function triggerVisibility(
  video: HTMLVideoElement,
  isIntersecting: boolean,
): void {
  if (!intersectionCallback) {
    throw new Error("Expected Highlights to register an observer");
  }

  const bounds = video.getBoundingClientRect();
  const entry: IntersectionObserverEntry = {
    boundingClientRect: bounds,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: bounds,
    isIntersecting,
    rootBounds: null,
    target: video,
    time: 0,
  };
  intersectionCallback([entry], callbackObserver);
}

async function flushPlayback(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("HighlightsSection video resilience", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
    intersectionCallback = undefined;
    vi.stubGlobal("IntersectionObserver", ControlledIntersectionObserver);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: false }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(["AbortError", "NotAllowedError"])(
    "consumes the expected %s playback rejection",
    async (errorName) => {
      const play = vi
        .spyOn(HTMLMediaElement.prototype, "play")
        .mockRejectedValue(new DOMException("Expected rejection", errorName));
      const pause = vi
        .spyOn(HTMLMediaElement.prototype, "pause")
        .mockImplementation(() => undefined);
      const unhandledRejections: unknown[] = [];
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        unhandledRejections.push(event.reason);
      };
      window.addEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
      const rendered = renderHighlights();
      const video = getBackgroundVideo(rendered.container);

      act(() => {
        triggerVisibility(video, true);
      });
      await flushPlayback();
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );

      expect(play).toHaveBeenCalledOnce();
      expect(pause).not.toHaveBeenCalled();
      expect(unhandledRejections).toHaveLength(0);
      expect(rendered.container.querySelector("#bgVideo")).toBe(video);
    },
  );

  it("keeps the component mounted and pauses after an unexpected rejection", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValue(
        new DOMException("Unsupported media", "NotSupportedError"),
      );
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    const unhandledRejections: unknown[] = [];
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      unhandledRejections.push(event.reason);
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    const rendered = renderHighlights();
    const video = getBackgroundVideo(rendered.container);

    act(() => {
      triggerVisibility(video, true);
    });
    await flushPlayback();
    window.removeEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
    );

    expect(play).toHaveBeenCalledOnce();
    expect(pause).toHaveBeenCalledOnce();
    expect(unhandledRejections).toHaveLength(0);
    expect(rendered.container.querySelector("#bgVideo")).toBe(video);
  });

  it("preserves normal visibility-based playback controls", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    const rendered = renderHighlights();
    const video = getBackgroundVideo(rendered.container);

    act(() => {
      triggerVisibility(video, true);
    });
    await flushPlayback();
    act(() => {
      triggerVisibility(video, false);
    });

    expect(play).toHaveBeenCalledOnce();
    expect(pause).toHaveBeenCalledOnce();
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
  });
});

describe("HighlightsSection positioning", () => {
  beforeEach(() => {
    intersectionCallback = undefined;
    vi.stubGlobal("IntersectionObserver", ControlledIntersectionObserver);
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: true }),
    );
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders the six approved concepts and icons in Spanish", () => {
    localStorage.setItem("language", "es");
    const rendered = renderHighlights();
    const section = getHighlightsSection(rendered.container);

    expect(section).toHaveTextContent("¿Por qué trabajar conmigo?");
    for (const text of [
      "Visión de producto",
      "Defino cada solución desde el problema, el usuario y la prioridad del negocio.",
      "Tecnología con propósito",
      "Elijo herramientas por su utilidad, mantenibilidad y capacidad de acompañar el proyecto.",
      "Comunicación directa",
      "Trabajás conmigo de principio a fin, con decisiones claras y sin intermediarios.",
      "Experiencia real de negocio",
      "Aplico una mirada práctica sobre operación, clientes y decisiones de producto.",
      "Automatización e integraciones",
      "Conecto sistemas y herramientas para reducir tareas manuales y mejorar procesos.",
      "Evolución por etapas",
      "Priorizamos lo esencial y construimos una base que puede crecer sin complicar el MVP.",
    ]) {
      expect(section).toHaveTextContent(text);
    }
    expect(section.querySelectorAll("h3")).toHaveLength(6);
    expect(
      Array.from(
        section.querySelectorAll<SVGElement>("[data-highlight-icon]"),
        (icon) => icon.dataset.highlightIcon,
      ),
    ).toEqual([
      "product",
      "purpose",
      "direct",
      "business",
      "automation",
      "stages",
    ]);
    expect(section).not.toHaveTextContent("Velocidad y rendimiento");
    expect(section).not.toHaveTextContent("Diseño responsive");
    expect(section).not.toHaveTextContent("SEO integrado");
    expect(section).not.toHaveTextContent("Pagos online embebidos");
  });

  it("renders the equivalent positioning in English", () => {
    localStorage.setItem("language", "en");
    const rendered = renderHighlights();
    const section = getHighlightsSection(rendered.container);

    expect(section).toHaveTextContent("Why work with me?");
    for (const text of [
      "Product vision",
      "I shape each solution around the problem, the user, and the business priority.",
      "Purposeful technology",
      "I choose tools for their usefulness, maintainability, and fit for the project.",
      "Direct communication",
      "You work directly with me from start to finish, with clear decisions and no intermediaries.",
      "Real business experience",
      "I bring a practical perspective on operations, customers, and product decisions.",
      "Automation and integrations",
      "I connect systems and tools to reduce manual work and improve processes.",
      "Phased evolution",
      "We prioritize what matters and build a foundation that can grow without overcomplicating the MVP.",
    ]) {
      expect(section).toHaveTextContent(text);
    }
    expect(section.querySelectorAll("h3")).toHaveLength(6);
  });
});
