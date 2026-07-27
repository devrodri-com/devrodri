import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FaqSection from "../Components/FaqSection";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

function renderFaq(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <FaqSection />
    </LanguageProvider>,
  );
}

describe("FaqSection", () => {
  it("keeps the Spanish technology override and FAQ order", () => {
    renderFaq("es");

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(13);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "¿Qué tecnologías usás para desarrollar los sitios?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Next.js, React, Vite (según proyecto), TypeScript, Tailwind, Firebase (Firestore/Auth/Hosting/Storage), Stripe/PayPal, n8n y MCP (automatizaciones), ImageKit/Cloudinary (medios), Framer Motion y multilenguaje según proyecto (p. ej. React Context o next-intl).",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the English technology override and FAQ order", () => {
    renderFaq("en");

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(13);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "What technologies do you use to build websites?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Next.js, React, Vite (per project), TypeScript, Tailwind, Firebase (Firestore/Auth/Hosting/Storage), Stripe/PayPal, n8n & MCP (automations), ImageKit/Cloudinary (media), Framer Motion, and multilingual setups as needed (e.g. React Context or next-intl).",
      ),
    ).toBeInTheDocument();
  });
});
