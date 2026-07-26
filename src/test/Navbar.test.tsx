import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { LanguageProvider } from "../LanguageContext";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    </MemoryRouter>,
  );
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
});
