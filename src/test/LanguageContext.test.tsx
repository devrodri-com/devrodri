import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import {
  LanguageProvider,
  useLanguage,
} from "../LanguageContext";

function LanguageProbe() {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <p>{language === "es" ? "Contenido ES" : "English content"}</p>
      <button type="button" onClick={() => setLanguage("es")}>
        ES
      </button>
      <button type="button" onClick={() => setLanguage("en")}>
        EN
      </button>
    </div>
  );
}

function renderLanguageProbe() {
  return render(
    <LanguageProvider>
      <LanguageProbe />
    </LanguageProvider>,
  );
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "es-UY",
    });
  });

  it("defaults to Spanish when there is no valid saved preference", async () => {
    renderLanguageProbe();

    expect(await screen.findByText("Contenido ES")).toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("es");
  });

  it("honors a valid saved English preference", async () => {
    localStorage.setItem("language", "en");

    renderLanguageProbe();

    expect(await screen.findByText("English content")).toBeInTheDocument();
  });

  it("recovers from an invalid saved value", async () => {
    localStorage.setItem("language", "invalid");

    renderLanguageProbe();

    expect(await screen.findByText("Contenido ES")).toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("es");
  });

  it("switches content and persists the selected language", async () => {
    const user = userEvent.setup();
    renderLanguageProbe();

    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByText("English content")).toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("en");

    await user.click(screen.getByRole("button", { name: "ES" }));
    expect(screen.getByText("Contenido ES")).toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("es");
  });
});
