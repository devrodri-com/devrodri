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

const portfolioCases = [
  { key: "lem_box", title: "LEM-BOX" },
  { key: "zentra", title: "ZENTRA" },
  { key: "esteban", title: "Esteban Firpo · Miami Real Estate" },
  { key: "mutter", title: "Mutter Games" },
  { key: "magenta", title: "Imprenta Magenta · Paysandú, Uruguay" },
  { key: "federico", title: "Federico Roma" },
  { key: "boating", title: "Boating Adventures Miami" },
  { key: "campings_demo", title: "Plataforma de reservas de campings" },
] as const;

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

  it("shows the four approved home cases with case-study deep links", async () => {
    renderApp("/");
    await screen.findByRole("heading", {
      level: 2,
      name: "Algunos resultados recientes",
    });

    expect(
      screen
        .getAllByRole("link", {
          name: /Ver este caso en el portfolio:/,
        })
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual([
      "Ver este caso en el portfolio: LEM-BOX",
      "Ver este caso en el portfolio: ZENTRA",
      "Ver este caso en el portfolio: Esteban Firpo · Miami Real Estate",
      "Ver este caso en el portfolio: Mutter Games",
    ]);
  });

  it("filters the central portfolio catalog", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", {
      level: 1,
      name: "Algunos trabajos",
    });

    await user.click(screen.getByRole("button", { name: "Marca" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "ZENTRA" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 3,
        name: "Imprenta Magenta · Paysandú, Uruguay",
      }),
    ).not.toBeInTheDocument();
  });

  it("expands and contracts all eight cases with the same ARIA contract", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 3, name: "LEM-BOX" });

    for (const portfolioCase of portfolioCases) {
      const title = screen.getByRole("heading", {
        level: 3,
        name: portfolioCase.title,
      });
      const cardContent = title.parentElement;
      expect(cardContent).not.toBeNull();
      if (cardContent === null) {
        throw new Error(`Portfolio card content is missing: ${portfolioCase.key}`);
      }

      const detailsId = `portfolio-details-${portfolioCase.key}`;
      const expandButton = within(cardContent).getByRole("button", {
        name: "Ver más",
      });
      expect(expandButton).toHaveAttribute("aria-expanded", "false");
      expect(expandButton).toHaveAttribute("aria-controls", detailsId);

      await user.click(expandButton);
      expect(document.getElementById(detailsId)).toBeInTheDocument();
      expect(
        within(cardContent).getByRole("button", { name: "Ver menos" }),
      ).toHaveAttribute("aria-expanded", "true");

      await user.click(
        within(cardContent).getByRole("button", { name: "Ver menos" }),
      );
      expect(document.getElementById(detailsId)).not.toBeInTheDocument();
    }
  });

  it("opens a valid home deep link from route state", async () => {
    renderApp({
      pathname: "/portfolio",
      state: { focusCase: "lem_box" },
    });

    const title = await screen.findByRole("heading", {
      level: 3,
      name: "LEM-BOX",
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
        document.getElementById("portfolio-details-lem_box"),
      ).toBeInTheDocument();
      expect(within(cardContent).getByText("Mi rol")).toBeInTheDocument();
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
