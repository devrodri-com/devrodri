import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CTASection from "../Components/CTASection";
import translations from "../i18n";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>(
    "framer-motion",
  );

  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

const approvedDestinations = {
  whatsapp:
    "https://wa.me/17544653318?text=Hola%20Rodrigo%2C%20vengo%20de%20devrodri.com%20y%20quiero%20empezar%20un%20proyecto",
  emailEs:
    "mailto:r.opalo@icloud.com?subject=Comencemos%20tu%20proyecto",
  emailEn: "mailto:r.opalo@icloud.com?subject=Start%20a%20new%20project",
} as const;

function renderCta(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <CTASection />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function renderControlledCta() {
  return (
    <MemoryRouter>
      <LanguageProvider language="es">
        <CTASection />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe("CTASection", () => {
  it("renders the approved Spanish closing CTA and destinations", () => {
    renderCta("es");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "¿Tenés un proyecto en mente?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Compartime el contexto y vemos cuál es el mejor punto de partida.",
      ),
    ).toBeInTheDocument();

    const primaryCta = screen.getByRole("link", {
      name: "Ir al formulario de contacto",
    });
    expect(primaryCta).toHaveTextContent("Contame tu proyecto");
    expect(primaryCta).toHaveAttribute("href", "/#contacto");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      approvedDestinations.whatsapp,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      approvedDestinations.emailEs,
    );
  });

  it("renders the approved English closing CTA and destinations", () => {
    renderCta("en");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Have a project in mind?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Share the context and we'll figure out the best place to start.",
      ),
    ).toBeInTheDocument();

    const primaryCta = screen.getByRole("link", {
      name: "Go to contact form",
    });
    expect(primaryCta).toHaveTextContent("Tell me about your project");
    expect(primaryCta).toHaveAttribute("href", "/en#contacto");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      approvedDestinations.whatsapp,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      approvedDestinations.emailEn,
    );
  });

  it("removes the previous CTA copy without adding dashes or requests", () => {
    const publicCopy = JSON.stringify({
      es: translations.es.call,
      en: translations.en.call,
    });

    for (const oldCopy of [
      "¿Listo para destacar online?",
      "Contame tu idea por el formulario y te respondo para alinear alcance y próximos pasos.",
      "Empezar proyecto",
      "Ready to stand out online?",
      "Tell me about your idea via the form and I’ll follow up to align scope and next steps.",
      "Start project",
    ]) {
      expect(publicCopy).not.toContain(oldCopy);
    }

    expect(publicCopy).not.toMatch(/[\u2013\u2014]/);
  });

  it("hydrates without a mismatch and keeps the CTA visible for reduced motion", async () => {
    const serverMarkup = renderToString(renderControlledCta());
    expect(serverMarkup).toContain('id="cta"');
    expect(serverMarkup).not.toContain("opacity:0");

    const container = document.createElement("div");
    container.innerHTML = serverMarkup;
    document.body.append(container);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: Root | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(container, renderControlledCta());
      });

      await waitFor(() => {
        expect(container.querySelector("#cta")).toBeVisible();
      });
      expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(
        /hydration|did not match|server html/i,
      );
    } finally {
      consoleError.mockRestore();
      await act(async () => {
        root?.unmount();
      });
      container.remove();
    }
  });
});
