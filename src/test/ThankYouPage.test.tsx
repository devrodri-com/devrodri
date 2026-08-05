import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import SeoHead from "../Components/SeoHead";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";
import { getStructuredData } from "../seo/structuredData";

vi.mock("../lib/analytics", () => ({
  isAnalyticsClickLabel: vi.fn(() => false),
  trackAnalyticsClick: vi.fn(),
  trackPageView: vi.fn(),
}));

vi.mock("../seo/structuredData", () => ({
  getStructuredData: vi.fn(() => null),
}));

const confirmationRoutes = [
  {
    cta: "Volver al inicio",
    ctaPath: "/",
    description:
      "Gracias por escribirme. Recibí tu consulta y te voy a responder lo antes posible.",
    heading: "Consulta enviada",
    locale: "es",
    pathname: "/gracias",
    title: "Consulta enviada | Rodrigo Opalo",
  },
  {
    cta: "Back to home",
    ctaPath: "/en",
    description:
      "Thanks for getting in touch. I received your inquiry and will get back to you as soon as possible.",
    heading: "Inquiry sent",
    locale: "en",
    pathname: "/en/thank-you",
    title: "Inquiry sent | Rodrigo Opalo",
  },
] as const;

function renderRoute(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <RoutedLanguageProvider>
        <App />
      </RoutedLanguageProvider>
    </MemoryRouter>,
  );
}

function clearAnalyticsRuntime(): void {
  document.getElementById("devrodri-google-tag")?.remove();
  Reflect.deleteProperty(window, "dataLayer");
  Reflect.deleteProperty(window, "gtag");
}

describe("localized confirmation pages", () => {
  beforeEach(() => {
    vi.mocked(getStructuredData).mockClear();
    clearAnalyticsRuntime();
  });

  afterEach(() => {
    clearAnalyticsRuntime();
    vi.unstubAllEnvs();
  });

  it.each(confirmationRoutes)(
    "renders the exact localized contract for $pathname without discovery metadata",
    async ({ cta, ctaPath, description, heading, locale, pathname, title }) => {
      renderRoute(pathname);

      expect(
        await screen.findByRole("heading", { level: 1, name: heading }),
      ).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: cta })).toHaveAttribute(
        "href",
        ctaPath,
      );
      expect(screen.getAllByRole("main")).toHaveLength(1);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute("lang", locale);
        expect(document.title).toBe(title);
        expect(document.head.querySelector('meta[name="description"]'))
          .toHaveAttribute("content", description);
        expect(document.head.querySelector('meta[name="robots"]'))
          .toHaveAttribute("content", "noindex, nofollow");
        expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
        expect(document.head.querySelector('link[rel="alternate"]')).toBeNull();
        expect(document.head.querySelector('meta[property^="og:"]')).toBeNull();
        expect(document.head.querySelector('meta[name^="twitter:"]')).toBeNull();
        expect(
          document.head.querySelector('script[type="application/ld+json"]'),
        ).toBeNull();
      });

      expect(getStructuredData).not.toHaveBeenCalled();

      const main = screen.getByRole("main");
      const shell = main.parentElement;
      expect(main).toHaveClass("flex", "flex-1");
      expect(shell).toHaveClass("min-h-screen", "flex", "flex-col");
      expect(shell).toHaveStyle({ minHeight: "100dvh" });
      expect(screen.getByRole("contentinfo").parentElement).toBe(shell);
      expect(document.querySelector("form")).toBeNull();
      expect(screen.getByRole("link", { name: cta })).toHaveClass(
        "focus-visible:ring-2",
      );
      expect(document.querySelector("[data-nojs-visible]")).toBe(
        screen.getByRole("contentinfo"),
      );
    },
  );

  it.each([
    { pathname: "/", routeKey: "home:es" },
    { pathname: "/portfolio", routeKey: "portfolio:es" },
    { pathname: "/portfolio/lem-box", routeKey: "lem-box:es" },
    { pathname: "/servicios", routeKey: "services:es" },
    {
      pathname: "/servicios/sitios-web-para-empresas",
      routeKey: "business-websites:es",
    },
    {
      pathname: "/servicios/sistemas-a-medida",
      routeKey: "custom-software:es",
    },
    { pathname: "/en", routeKey: "home:en" },
    { pathname: "/en/portfolio", routeKey: "portfolio:en" },
    { pathname: "/en/portfolio/lem-box", routeKey: "lem-box:en" },
    { pathname: "/en/services", routeKey: "services:en" },
    {
      pathname: "/en/services/business-websites",
      routeKey: "business-websites:en",
    },
    {
      pathname: "/en/services/custom-software",
      routeKey: "custom-software:en",
    },
  ] as const)(
    "preserves structured-data resolution for the indexable route $pathname",
    ({ pathname, routeKey }) => {
      render(
        <MemoryRouter initialEntries={[pathname]}>
          <HelmetProvider>
            <SeoHead />
          </HelmetProvider>
        </MemoryRouter>,
      );

      expect(getStructuredData).toHaveBeenCalledOnce();
      expect(getStructuredData).toHaveBeenCalledWith(routeKey);
    },
  );

  it.each(confirmationRoutes)(
    "uses the localized Analytics bucket and title for $pathname",
    async ({ pathname, title }) => {
      vi.stubEnv("VITE_GA_ID", "G-TEST123456");
      window.history.replaceState(
        null,
        "",
        `${pathname}?email=private%40example.com&message=private#private`,
      );
      const { trackPageView } = await vi.importActual<
        typeof import("../lib/analytics")
      >("../lib/analytics");

      trackPageView(window.location.pathname);

      const commands = (window.dataLayer ?? []).map((entry) =>
        Array.from(entry) as GtagCommand,
      );
      expect(commands).toContainEqual([
        "event",
        "page_view",
        {
          page_location: `${window.location.origin}${pathname}`,
          page_path: pathname,
          page_title: title,
        },
      ]);
      expect(
        commands.filter(
          (command) =>
            command[0] === "event" && command[1] === "page_view",
        ),
      ).toHaveLength(1);
      expect(
        commands.some(
          (command) =>
            command[0] === "event" && command[1] === "generate_lead",
        ),
      ).toBe(false);
      expect(JSON.stringify(commands)).not.toMatch(/\/404|\/unknown/i);
      expect(JSON.stringify(commands)).not.toContain("private@example.com");
      expect(JSON.stringify(commands)).not.toContain("message");
    },
  );
});
