import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import translations from "../i18n";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { isLanguage } from "../i18n/language";
import { useLanguage } from "../i18n/useLanguage";

function collectTranslationPaths(value: unknown, path = "$"): string[] {
  if (typeof value === "string") return [path];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectTranslationPaths(item, `${path}[${index}]`),
    );
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      collectTranslationPaths(item, `${path}.${key}`),
    );
  }
  throw new Error(`Translation value at ${path} is not serializable copy`);
}

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

describe("i18n contract", () => {
  it("keeps the supported languages behind one guard", () => {
    expect(isLanguage("es")).toBe(true);
    expect(isLanguage("en")).toBe(true);
    expect(isLanguage(null)).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
    expect(isLanguage("")).toBe(false);
    expect(isLanguage("invalid")).toBe(false);
    expect(isLanguage("EN")).toBe(false);
  });

  it("keeps exact ES/EN key parity and serializable values", () => {
    const esPaths = collectTranslationPaths(translations.es);
    const enPaths = collectTranslationPaths(translations.en);

    expect(Object.keys(translations)).toEqual(["es", "en"]);
    expect(esPaths).toHaveLength(149);
    expect(enPaths).toEqual(esPaths);
    expect(JSON.parse(JSON.stringify(translations))).toEqual(translations);
  });
});

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
    expect(document.documentElement.lang).toBe("en");

    await user.click(screen.getByRole("button", { name: "ES" }));
    expect(screen.getByText("Contenido ES")).toBeInTheDocument();
    expect(localStorage.getItem("language")).toBe("es");
    expect(document.documentElement.lang).toBe("es");
  });

  it("continues with browser detection when storage reads are blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });

    renderLanguageProbe();

    expect(await screen.findByText("Contenido ES")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es");
  });

  it("keeps language changes in memory when storage writes fail", async () => {
    localStorage.setItem("language", "es");
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    const user = userEvent.setup();

    renderLanguageProbe();
    await user.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByText("English content")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");
  });

  it("fails descriptively when useLanguage is outside its provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<LanguageProbe />)).toThrow(
      "useLanguage must be used within a LanguageProvider",
    );
  });
});
