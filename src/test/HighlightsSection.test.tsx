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
