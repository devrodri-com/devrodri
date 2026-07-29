import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Footer from "../Components/Footer";
import translations from "../i18n";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";

const footerLinks = [
  {
    key: "github",
    href: "https://github.com/devrodri-com",
    external: true,
  },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/rodrigo-opalo-b56685390/",
    external: true,
  },
  {
    key: "email",
    href: "mailto:r.opalo@icloud.com",
    external: false,
  },
  {
    key: "whatsapp",
    href: "https://wa.me/17544653318",
    external: true,
  },
] as const;

const labels = {
  es: [
    "GitHub de Rodrigo Opalo",
    "LinkedIn de Rodrigo Opalo",
    "Enviar email a Rodrigo Opalo",
    "Contactar a Rodrigo Opalo por WhatsApp",
  ],
  en: [
    "Rodrigo Opalo on GitHub",
    "Rodrigo Opalo on LinkedIn",
    "Email Rodrigo Opalo",
    "Contact Rodrigo Opalo on WhatsApp",
  ],
} as const;

function renderFooter(language: Language) {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <Footer />
    </LanguageProvider>,
  );
}

describe("Footer", () => {
  it.each(["es", "en"] as const)(
    "keeps four links, exact copyright, and accessible %s names",
    (language) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-29T12:00:00Z"));
      renderFooter(language);

      const footer = screen.getByRole("contentinfo");
      const links = within(footer).getAllByRole("link");
      const legacyCredit = ["Made", "with", "code"].join(" ");

      expect(links).toHaveLength(4);
      expect(
        within(footer).getByText("© 2026 Rodrigo Opalo · devrodri"),
      ).toBeInTheDocument();
      expect(
        within(footer).queryByText(new RegExp(legacyCredit, "i")),
      ).not.toBeInTheDocument();

      labels[language].forEach((label, index) => {
        const link = within(footer).getByRole("link", { name: label });
        const expected = footerLinks[index];

        expect(expected).toBeDefined();
        if (expected === undefined) return;
        expect(link).toHaveAttribute("href", expected.href);
        expect(link).toHaveClass("text-[18px]", "after:h-10", "after:w-8");
        expect(link).not.toHaveClass(
          "inline-flex",
          "min-h-[44px]",
          "min-w-[44px]",
        );
        expect(link.className).toContain("focus-visible:ring-2");
        expect(link.querySelector("svg")).not.toBeNull();

        if (expected.external) {
          expect(link).toHaveAttribute("target", "_blank");
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
      });

      vi.useRealTimers();
    },
  );

  it("restores the compact baseline layout without overlapping hit areas", () => {
    renderFooter("es");

    const footer = screen.getByRole("contentinfo");
    const layout = footer.firstElementChild;
    const iconRow = layout?.firstElementChild;
    const links = within(footer).getAllByRole("link");

    expect(footer).toHaveClass("py-3", "px-4", "sm:px-6");
    expect(layout).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "gap-2",
      "sm:flex-row",
      "sm:justify-center",
      "sm:gap-3",
    );
    expect(iconRow).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "gap-4",
    );
    expect(links).toHaveLength(4);
    links.forEach((link) => {
      expect(link).toHaveClass(
        "relative",
        "text-[18px]",
        "after:h-10",
        "after:w-8",
      );
    });
  });

  it("keeps footer copy equivalent in Spanish and English without dash characters", () => {
    expect(translations.es.footer.rights).toBe("Rodrigo Opalo · devrodri");
    expect(translations.en.footer.rights).toBe("Rodrigo Opalo · devrodri");

    const publicCopy = JSON.stringify({
      es: translations.es.footer,
      en: translations.en.footer,
    });
    expect(publicCopy).not.toContain(["Made", "with"].join(" "));
    expect(publicCopy).not.toMatch(/[\u2013\u2014]/);
  });
});
