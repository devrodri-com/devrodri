import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { LanguageProvider } from "../i18n/LanguageProvider";

type TestRouteEntry =
  | string
  | {
      pathname: string;
      state: Record<string, unknown>;
    };

function renderApp(entry: TestRouteEntry) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[entry]}>
        <App />
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe("application routing", () => {
  beforeEach(() => {
    localStorage.setItem("language", "es");
  });

  it("mounts the home route", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Diseño web profesional.",
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        document.head.querySelector('link[rel="canonical"]'),
      ).toHaveAttribute("href", "https://www.devrodri.com");
    });
  });

  it.each(["/portfolio", "/portfolio/", "/Portfolio"])(
    "loads the lazy portfolio route and canonical metadata for %s",
    async (path) => {
      renderApp(path);

      expect(
        await screen.findByRole("heading", {
          level: 1,
          name: "Algunos trabajos",
        }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          document.head.querySelector('link[rel="canonical"]'),
        ).toHaveAttribute("href", "https://www.devrodri.com/portfolio");
        expect(
          document.head.querySelector('meta[name="robots"]'),
        ).not.toBeInTheDocument();
      });
    },
  );

  it("navigates internally from home to portfolio without throwing", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Diseño web profesional.",
    });

    await user.click(screen.getByRole("link", { name: "Portfolio" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algunos trabajos",
      }),
    ).toBeInTheDocument();
  });

  it("filters the central portfolio catalog", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", {
      level: 1,
      name: "Algunos trabajos",
    });

    await user.click(screen.getByRole("button", { name: "Personal" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "Federico Roma" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: "Imprenta Magenta · Paysandú, Uruguay",
      }),
    ).not.toBeInTheDocument();
  });

  it("expands and contracts case details with the same ARIA contract", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    const title = await screen.findByRole("heading", {
      level: 3,
      name: "Imprenta Magenta · Paysandú, Uruguay",
    });
    const cardContent = title.parentElement;
    expect(cardContent).not.toBeNull();
    if (cardContent === null) {
      throw new Error("Portfolio card content is missing");
    }

    const expandButton = within(cardContent).getByRole("button", {
      name: "Ver más",
    });
    expect(expandButton).toHaveAttribute("aria-expanded", "false");
    expect(expandButton).toHaveAttribute(
      "aria-controls",
      "portfolio-details-magenta",
    );

    await user.click(expandButton);
    expect(
      document.getElementById("portfolio-details-magenta"),
    ).toBeInTheDocument();
    expect(
      within(cardContent).getByRole("button", { name: "Ver menos" }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(
      within(cardContent).getByRole("button", { name: "Ver menos" }),
    );
    expect(
      document.getElementById("portfolio-details-magenta"),
    ).not.toBeInTheDocument();
  });

  it("opens a valid home deep link from route state", async () => {
    renderApp({
      pathname: "/portfolio",
      state: { focusCase: "lem_portal" },
    });

    const title = await screen.findByRole("heading", {
      level: 3,
      name: "LEM-BOX Portal (Sistema)",
    });
    const cardContent = title.parentElement;
    expect(cardContent).not.toBeNull();
    if (cardContent === null) {
      throw new Error("Focused portfolio card content is missing");
    }

    await waitFor(() => {
      expect(
        within(cardContent).getByRole("button", { name: "Ver menos" }),
      ).toHaveAttribute("aria-expanded", "true");
      expect(
        document.getElementById("portfolio-details-lem_portal"),
      ).toBeInTheDocument();
    });
  });

  it("shows the Spanish not-found route with noindex metadata", async () => {
    renderApp("/ruta-inexistente");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Página no encontrada",
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    });
  });

  it("shows the English not-found route", async () => {
    localStorage.setItem("language", "en");
    renderApp("/missing-page");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Page not found",
      }),
    ).toBeInTheDocument();
  });

  it("returns home from the not-found route through React Router", async () => {
    const user = userEvent.setup();
    renderApp("/ruta-inexistente");

    await user.click(
      await screen.findByRole("link", { name: "Volver al inicio" }),
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Diseño web profesional.",
      }),
    ).toBeInTheDocument();
  });
});
