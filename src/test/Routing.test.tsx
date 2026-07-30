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

const expandablePortfolioCases = [
  { key: "zentra", title: "ZENTRA" },
  { key: "esteban", title: "Esteban Firpo · Miami Real Estate" },
  { key: "mutter", title: "Mutter Games" },
  { key: "magenta", title: "Imprenta Magenta · Paysandú, Uruguay" },
  { key: "federico", title: "Federico Roma" },
  { key: "boating", title: "Boating Adventures Miami" },
  { key: "campings_demo", title: "Plataforma de reservas de campings" },
] as const;

const lemBoxSeo = {
  es: {
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    description:
      "Caso de producto propio: un ecosistema digital conectado con la operación logística de LEM-BOX en Estados Unidos, Uruguay y Argentina.",
  },
  en: {
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    description:
      "Own-product case study: a digital ecosystem connected to LEM-BOX's logistics operation across the United States, Uruguay, and Argentina.",
  },
} as const;

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
        name: "Sitios web que comunican y convierten.",
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
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("link", { name: "Portfolio" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algunos trabajos",
      }),
    ).toBeInTheDocument();
  });

  it("opens Portfolio from the first Hero CTA", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(screen.getByRole("link", { name: "Ver trabajos" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algunos trabajos",
      }),
    ).toBeInTheDocument();
  });

  it("keeps the fourth Hero CTA connected to Contacto", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(
      screen.getByRole("tab", {
        name: "Ir al slide 4 de 4: Menos tareas manuales. Más tiempo para crecer.",
      }),
    );

    expect(
      screen.getByRole("link", { name: "Contame tu proceso" }),
    ).toHaveAttribute("href", "#contacto");
    expect(document.getElementById("contacto")).toBeInTheDocument();
  });

  it("shows the four approved home cases with case-study deep links", async () => {
    renderApp("/");
    await screen.findByRole("heading", {
      level: 2,
      name: "Proyectos seleccionados",
    });

    expect(
      screen.getByRole("link", { name: "Ver caso LEM-BOX" }),
    ).toHaveAttribute("href", "/portfolio/lem-box");
    expect(
      screen
        .getAllByRole("link", { name: /Ver este caso en el portfolio:/ })
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual([
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

  it("shows the LEM-BOX summary card with one internal case-study CTA", async () => {
    renderApp("/portfolio");

    const title = await screen.findByRole("heading", {
      level: 3,
      name: "LEM-BOX",
    });
    const cardContent = title.parentElement;
    expect(cardContent).not.toBeNull();
    if (cardContent === null) {
      throw new Error("LEM-BOX portfolio card content is missing");
    }

    expect(
      within(cardContent).getByRole("link", { name: "Ver caso completo" }),
    ).toHaveAttribute("href", "/portfolio/lem-box");
    expect(
      within(cardContent).queryByRole("button", { name: "Ver más" }),
    ).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Ver plataforma")).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Uruguay")).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Argentina")).not.toBeInTheDocument();
    expect(
      document.getElementById("portfolio-details-lem_box"),
    ).not.toBeInTheDocument();
  });

  it("expands and contracts the other seven cases with the same ARIA contract", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 3, name: "LEM-BOX" });

    for (const portfolioCase of expandablePortfolioCases) {
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

  it("keeps a valid ZENTRA deep link from route state", async () => {
    renderApp({
      pathname: "/portfolio",
      state: { focusCase: "zentra" },
    });

    const title = await screen.findByRole("heading", {
      level: 3,
      name: "ZENTRA",
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
        document.getElementById("portfolio-details-zentra"),
      ).toBeInTheDocument();
      expect(within(cardContent).getByText("Mi rol")).toBeInTheDocument();
    });
  });

  it("opens the LEM-BOX case study from its Hero CTA", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", {
      level: 1,
      name: "Sitios web que comunican y convierten.",
    });

    await user.click(
      screen.getByRole("tab", {
        name: "Ir al slide 2 de 4: Software a medida para operar mejor.",
      }),
    );
    await user.click(screen.getByRole("link", { name: "Ver LEM-BOX" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "LEM-BOX" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Un producto conectado a una operación real",
      }),
    ).toBeInTheDocument();
  });

  it.each([
    {
      slideName:
        "Ir al slide 3 de 4: Marcas con dirección y presencia digital.",
      ctaName: "Ver ZENTRA",
      caseTitle: "ZENTRA",
      detailsId: "portfolio-details-zentra",
    },
  ])(
    "keeps opening and expanding $caseTitle from its Hero CTA",
    async ({ slideName, ctaName, caseTitle, detailsId }) => {
      const user = userEvent.setup();
      renderApp("/");
      await screen.findByRole("heading", {
        level: 1,
        name: "Sitios web que comunican y convierten.",
      });

      await user.click(screen.getByRole("tab", { name: slideName }));
      await user.click(screen.getByRole("link", { name: ctaName }));

      const title = await screen.findByRole("heading", {
        level: 3,
        name: caseTitle,
      });
      const cardContent = title.parentElement;
      expect(cardContent).not.toBeNull();
      if (cardContent === null) {
        throw new Error(`Focused portfolio card content is missing: ${caseTitle}`);
      }

      await waitFor(() => {
        expect(document.getElementById(detailsId)).toBeInTheDocument();
        expect(
          within(cardContent).getByRole("button", { name: "Ver menos" }),
        ).toHaveAttribute("aria-expanded", "true");
      });
    },
  );

  it.each(["/portfolio/lem-box", "/portfolio/lem-box/"])(
    "loads the LEM-BOX case study and canonical metadata for %s",
    async (path) => {
      renderApp(path);

      expect(
        await screen.findByRole("heading", { level: 1, name: "LEM-BOX" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Fundador, propietario y Operations Manager. Lidero producto, procesos y desarrollo full-stack del ecosistema digital.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Producto propio · En operación"),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(document.title).toBe(lemBoxSeo.es.title);
        expect(
          document.head.querySelector('meta[name="description"]'),
        ).toHaveAttribute("content", lemBoxSeo.es.description);
        expect(
          document.head.querySelector('link[rel="canonical"]'),
        ).toHaveAttribute(
          "href",
          "https://www.devrodri.com/portfolio/lem-box",
        );
        expect(
          document.head.querySelector('meta[property="og:type"]'),
        ).toHaveAttribute("content", "article");
        expect(
          document.head.querySelector('meta[property="og:url"]'),
        ).toHaveAttribute(
          "content",
          "https://www.devrodri.com/portfolio/lem-box",
        );
        expect(
          document.head.querySelector('meta[property="og:image"]'),
        ).toHaveAttribute(
          "content",
          "https://www.devrodri.com/img/lem-box-cover.png",
        );
        expect(
          document.head.querySelector('meta[name="robots"]'),
        ).not.toBeInTheDocument();
      });
    },
  );

  it("renders the refined Spanish LEM-BOX summary without a secondary note", async () => {
    renderApp("/portfolio/lem-box");

    const summaryHeading = await screen.findByRole("heading", {
      level: 2,
      name: "Un producto conectado a una operación real",
    });
    const summarySection = summaryHeading.closest("section");
    expect(summarySection).not.toBeNull();
    if (summarySection === null) {
      throw new Error("Missing LEM-BOX summary section");
    }

    expect(
      within(summarySection).getByText(
        "LEM-BOX es un negocio logístico con más de 10 años de trayectoria. Su ecosistema digital actual forma parte de una evolución más reciente y conecta los sitios comerciales de Uruguay y Argentina con una plataforma central utilizada por clientes, partners y el equipo operativo.",
      ),
    ).toBeInTheDocument();
    expect(summarySection.querySelectorAll("p")).toHaveLength(1);
    expect(summarySection.querySelector('[class*="border-l"]')).toBeNull();
    expect(
      screen.queryByText(
        "Los más de 10 años corresponden a la trayectoria del negocio, no a la antigüedad de la plataforma actual.",
      ),
    ).not.toBeInTheDocument();

    for (const sectionTitle of [
      "El desafío",
      "Mi rol",
      "Un ecosistema, distintas experiencias",
      "Experiencias según cada necesidad",
      "De procesos dispersos a un producto conectado",
      "Base técnica",
      "Estados Unidos, Uruguay y Argentina",
      "Un producto en evolución continua",
      "Conocer el ecosistema",
      "¿Necesitás un sistema conectado a una operación real?",
    ]) {
      expect(
        screen.getByRole("heading", { name: sectionTitle }),
      ).toBeInTheDocument();
    }
  });

  it("renders the refined challenge and role without a center divider", async () => {
    renderApp("/portfolio/lem-box");

    const challengeHeading = await screen.findByRole("heading", {
      level: 2,
      name: "El desafío",
    });
    const roleHeading = screen.getByRole("heading", {
      level: 2,
      name: "Mi rol",
    });
    const challengeSection = challengeHeading.closest("section");
    const roleSection = roleHeading.closest("section");
    expect(challengeSection).not.toBeNull();
    expect(roleSection).not.toBeNull();
    if (challengeSection === null || roleSection === null) {
      throw new Error("Missing LEM-BOX challenge or role section");
    }

    const columns = challengeSection.parentElement;
    expect(columns).toBe(roleSection.parentElement);
    expect(columns).toHaveClass("lg:grid-cols-2", "lg:gap-20");
    expect(columns).not.toHaveClass("lg:divide-x", "lg:divide-white/10");
    expect(challengeSection).toHaveClass(
      "border-t",
      "border-white/15",
      "pt-7",
    );
    expect(roleSection).toHaveClass("border-t", "border-white/15", "pt-7");
    expect(
      within(challengeSection).getByText(
        "La operación necesitaba continuidad entre la captación comercial, la recepción y consolidación de paquetes, los embarques, el tracking, los pagos y la atención. El desafío no era crear una web aislada, sino conectar mercados, usuarios y procesos en un producto alineado con la operación real.",
      ),
    ).toBeInTheDocument();
    expect(
      within(roleSection).getByText(
        "Mi trabajo parte de la operación diaria: traduzco necesidades reales en prioridades de producto, flujos y funcionalidades, y llevo esas decisiones hasta la implementación y evolución técnica del ecosistema.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the English LEM-BOX case study and exact metadata", async () => {
    localStorage.setItem("language", "en");
    renderApp("/portfolio/lem-box");

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "A product connected to a real operation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "LEM-BOX is a logistics business with more than 10 years of experience. Its current digital ecosystem is part of a more recent evolution and connects the commercial websites for Uruguay and Argentina with a central platform used by customers, partners, and the operations team.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        "The more than 10 years refer to the business's trajectory, not the age of the current platform.",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "The operation needed continuity across customer acquisition, package intake and consolidation, shipments, tracking, payments, and support. The challenge was not to build an isolated website, but to connect markets, users, and processes through a product aligned with the real operation.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "My work starts with day-to-day operations: I turn real needs into product priorities, workflows, and features, and carry those decisions through implementation and the ecosystem's technical evolution.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Founder, owner, and Operations Manager. I lead product, processes, and full-stack development of the digital ecosystem.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Own product · In operation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to portfolio" }),
    ).toHaveTextContent("←Back to portfolio");
    await waitFor(() => {
      expect(document.title).toBe(lemBoxSeo.en.title);
      expect(
        document.head.querySelector('meta[name="description"]'),
      ).toHaveAttribute("content", lemBoxSeo.en.description);
    });
  });

  it("removes static fallback metadata after the LEM-BOX metadata mounts", async () => {
    const fallbackDescription = document.createElement("meta");
    fallbackDescription.name = "description";
    fallbackDescription.content = "Static fallback description";
    document.head.append(fallbackDescription);

    const fallbackOgType = document.createElement("meta");
    fallbackOgType.setAttribute("property", "og:type");
    fallbackOgType.content = "website";
    document.head.append(fallbackOgType);

    renderApp("/portfolio/lem-box");
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    await waitFor(() => {
      expect(
        document.head.querySelectorAll('meta[name="description"]'),
      ).toHaveLength(1);
      expect(
        document.head.querySelector('meta[name="description"]'),
      ).toHaveAttribute("content", lemBoxSeo.es.description);
      expect(
        document.head.querySelectorAll('meta[property="og:type"]'),
      ).toHaveLength(1);
      expect(
        document.head.querySelector('meta[property="og:type"]'),
      ).toHaveAttribute("content", "article");
    });
  });

  it("provides portfolio return, DevRodri CTA, public links, and one cover", async () => {
    renderApp("/portfolio/lem-box");
    await screen.findByRole("heading", { level: 1, name: "LEM-BOX" });

    const portfolioReturn = screen.getByRole("link", {
      name: "Volver al portfolio",
    });
    expect(portfolioReturn).toHaveAttribute("href", "/portfolio");
    expect(portfolioReturn).toHaveTextContent("←Volver al portfolio");
    expect(
      screen.getByRole("link", { name: "Contame tu proyecto" }),
    ).toHaveAttribute("href", "/#contacto");
    expect(screen.getByRole("link", { name: /Ver plataforma/ })).toHaveAttribute(
      "href",
      "https://lem-box.com",
    );
    expect(screen.getByRole("link", { name: "Uruguay" })).toHaveAttribute(
      "href",
      "https://lem-box.com.uy",
    );
    expect(screen.getByRole("link", { name: "Argentina" })).toHaveAttribute(
      "href",
      "https://lem-box.com.ar",
    );
    const publicLinkHrefs = new Set([
      "https://lem-box.com",
      "https://lem-box.com.uy",
      "https://lem-box.com.ar",
    ]);
    const publicLinks = screen
      .getAllByRole("link")
      .filter((candidate) =>
        publicLinkHrefs.has(candidate.getAttribute("href") ?? ""),
      );
    expect(publicLinks).toHaveLength(3);
    for (const link of publicLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getAllByRole("img", { name: "Portada de LEM-BOX" })).toHaveLength(
      1,
    );
    expect(screen.getByRole("img", { name: "Portada de LEM-BOX" })).toHaveAttribute(
      "width",
      "1200",
    );
    expect(screen.getByRole("img", { name: "Portada de LEM-BOX" })).toHaveAttribute(
      "height",
      "630",
    );
  });

  it("keeps an invalid portfolio slug on NotFound with noindex", async () => {
    renderApp("/portfolio/not-a-case");

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
        name: "Sitios web que comunican y convierten.",
      }),
    ).toBeInTheDocument();
  });
});
