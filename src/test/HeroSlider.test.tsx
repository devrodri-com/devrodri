import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HeroSlider from "../Components/HeroSlider";
import { LanguageProvider } from "../LanguageContext";

function renderHero() {
  return render(
    <LanguageProvider>
      <HeroSlider />
    </LanguageProvider>,
  );
}

describe("HeroSlider resilience", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps approved slide navigation working", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByRole("button", { name: "Slide siguiente" }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Software funcional y escalable.",
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
        name: "Software funcional y escalable.",
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
        name: "Software funcional y escalable.",
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
