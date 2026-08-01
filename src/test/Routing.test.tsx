import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App";
import { RoutedLanguageProvider } from "../i18n/LanguageProvider";
import {
  STRUCTURED_DATA_BY_ROUTE,
} from "../seo/structuredData";

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

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="current-test-location">
      {location.pathname}
      {location.search}
      {location.hash}
    </output>
  );
}

function renderApp(entry: TestRouteEntry) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <RoutedLanguageProvider>
        <App />
        <LocationProbe />
      </RoutedLanguageProvider>
    </MemoryRouter>,
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
      ).toHaveAttribute("href", "https://www.devrodri.com/");
    });
  });

  it.each([
    { pathname: "/", routeKey: "home:es" },
    { pathname: "/portfolio", routeKey: "portfolio:es" },
    { pathname: "/portfolio/lem-box", routeKey: "lem-box:es" },
    { pathname: "/en", routeKey: "home:en" },
    { pathname: "/en/portfolio", routeKey: "portfolio:en" },
    { pathname: "/en/portfolio/lem-box", routeKey: "lem-box:en" },
  ] as const)(
    "keeps one client JSON-LD script at most for $pathname",
    async ({ pathname, routeKey }) => {
      renderApp(pathname);
      const expected = STRUCTURED_DATA_BY_ROUTE[routeKey];

      await waitFor(() => {
        const scripts = document.head.querySelectorAll(
          'script[type="application/ld+json"]',
        );
        expect(scripts).toHaveLength(expected === null ? 0 : 1);
        if (expected !== null) {
          expect(scripts[0]?.textContent).toBe(JSON.stringify(expected));
        }
      });
    },
  );

  it.each(["/portfolio", "/portfolio/", "/portfolio?utm_source=test"])(
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
        ).toHaveAttribute("content", "index, follow");
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

  it("preserves the equivalent page, query and hash when changing language", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio?source=vis01#portfolio-grid");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algunos trabajos",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-test-location")).toHaveTextContent(
      "/portfolio?source=vis01#portfolio-grid",
    );

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Some Work",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-test-location")).toHaveTextContent(
      "/en/portfolio?source=vis01#portfolio-grid",
    );
    expect(localStorage.getItem("language")).toBe("en");
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
      screen.getByRole("button", {
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
    const lemBoxHomeLink = screen.getByRole("link", {
      name: "Ver caso LEM-BOX",
    });
    const lemBoxHomePicture = lemBoxHomeLink.querySelector("picture");
    const lemBoxHomeImage = lemBoxHomePicture?.querySelector("img");
    expect(lemBoxHomePicture).not.toBeNull();
    expect(lemBoxHomePicture?.querySelectorAll("img")).toHaveLength(1);
    expect(lemBoxHomeImage).toHaveAttribute("loading", "lazy");
    expect(lemBoxHomeImage).not.toHaveAttribute("fetchpriority");
    expect(lemBoxHomeImage).toHaveClass("object-contain");
    expect(
      Array.from(lemBoxHomePicture?.querySelectorAll("source") ?? []).map(
        (source) => source.getAttribute("type"),
      ),
    ).toEqual(["image/avif", "image/webp"]);
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
      screen.getByRole("heading", { level: 2, name: "ZENTRA" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Imprenta Magenta · Paysandú, Uruguay",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows the LEM-BOX summary card with one internal case-study CTA", async () => {
    renderApp("/portfolio");

    const title = await screen.findByRole("heading", {
      level: 2,
      name: "LEM-BOX",
    });
    const cardContent = title.parentElement;
    expect(cardContent).not.toBeNull();
    if (cardContent === null) {
      throw new Error("LEM-BOX portfolio card content is missing");
    }

    expect(
      within(cardContent).getByRole("link", {
        name: "Ver caso completo: LEM-BOX",
      }),
    ).toHaveAttribute("href", "/portfolio/lem-box");
    expect(
      within(cardContent).queryByRole("button", { name: "Ver más: LEM-BOX" }),
    ).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Ver plataforma")).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Uruguay")).not.toBeInTheDocument();
    expect(within(cardContent).queryByText("Argentina")).not.toBeInTheDocument();
    expect(
      document.getElementById("portfolio-details-lem_box"),
    ).not.toBeInTheDocument();

    const portfolioCards = Array.from(
      document.querySelectorAll<HTMLElement>('[id^="portfolio-case-"]'),
    );
    const portfolioImages = portfolioCards.map((card) => {
      const image = card.querySelector("img");
      if (image === null) {
        throw new Error(`Missing portfolio image: ${card.id}`);
      }
      return image;
    });
    expect(portfolioImages).toHaveLength(8);
    expect(portfolioImages[0]).toHaveAttribute("loading", "eager");
    expect(portfolioImages[0]).toHaveAttribute("fetchpriority", "high");
    expect(portfolioImages[0]).toHaveClass("object-contain");
    expect(
      portfolioImages[0]?.closest("picture")?.querySelectorAll("img"),
    ).toHaveLength(1);
    for (const image of portfolioImages.slice(1)) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).not.toHaveAttribute("fetchpriority");
      expect(image).toHaveClass("object-cover");
    }
  });

  it("expands and contracts the other seven cases with the same ARIA contract", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio");
    await screen.findByRole("heading", { level: 2, name: "LEM-BOX" });

    for (const portfolioCase of expandablePortfolioCases) {
      const title = screen.getByRole("heading", {
        level: 2,
        name: portfolioCase.title,
      });
      const cardContent = title.parentElement;
      expect(cardContent).not.toBeNull();
      if (cardContent === null) {
        throw new Error(`Portfolio card content is missing: ${portfolioCase.key}`);
      }

      const detailsId = `portfolio-details-${portfolioCase.key}`;
      const expandButton = within(cardContent).getByRole("button", {
        name: `Ver más: ${portfolioCase.title}`,
      });
      expect(expandButton).toHaveAttribute("aria-expanded", "false");
      expect(expandButton).toHaveAttribute("aria-controls", detailsId);

      await user.click(expandButton);
      expect(document.getElementById(detailsId)).toBeInTheDocument();
      expect(
        within(cardContent).getByRole("button", {
          name: `Ver menos: ${portfolioCase.title}`,
        }),
      ).toHaveAttribute("aria-expanded", "true");

      await user.click(
        within(cardContent).getByRole("button", {
          name: `Ver menos: ${portfolioCase.title}`,
        }),
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
      level: 2,
      name: "ZENTRA",
    });
    const cardContent = title.parentElement;
    expect(cardContent).not.toBeNull();
    if (cardContent === null) {
      throw new Error("Focused portfolio card content is missing");
    }

    await waitFor(() => {
      expect(
        within(cardContent).getByRole("button", { name: "Ver menos: ZENTRA" }),
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
      screen.getByRole("button", {
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

      await user.click(screen.getByRole("button", { name: slideName }));
      await user.click(screen.getByRole("link", { name: ctaName }));

      const title = await screen.findByRole("heading", {
        level: 2,
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
          within(cardContent).getByRole("button", {
            name: `Ver menos: ${caseTitle}`,
          }),
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
        ).toHaveAttribute("content", "index, follow");
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
      "Una operación, tres mercados",
      "Un producto que evoluciona con la operación",
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
        "La operación necesitaba continuidad entre la captación comercial, la recepción y consolidación de paquetes, los embarques, el tracking y la atención. El desafío no era crear una web aislada, sino conectar mercados, usuarios y procesos en un producto alineado con la operación real.",
      ),
    ).toBeInTheDocument();
    expect(
      within(roleSection).getByText(
        "Mi trabajo parte de la operación diaria: traduzco necesidades reales en prioridades de producto, flujos y funcionalidades, y llevo esas decisiones hasta la implementación y evolución técnica del ecosistema.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the LEM-BOX ecosystem as a minimal editorial flow", async () => {
    renderApp("/portfolio/lem-box");

    const ecosystemHeading = await screen.findByRole("heading", {
      level: 2,
      name: "Un ecosistema, distintas experiencias",
    });
    const ecosystemSection = ecosystemHeading.closest("section");
    expect(ecosystemSection).not.toBeNull();
    if (ecosystemSection === null) {
      throw new Error("Missing LEM-BOX ecosystem section");
    }

    const flow = ecosystemSection.querySelector("[data-ecosystem-flow]");
    expect(flow).not.toBeNull();
    expect(
      ecosystemSection.querySelectorAll("[data-ecosystem-flow-stage]"),
    ).toHaveLength(3);
    expect(
      ecosystemSection.querySelectorAll("[data-ecosystem-flow-line]"),
    ).toHaveLength(3);
    expect(
      ecosystemSection.querySelectorAll("[data-ecosystem-flow-node]"),
    ).toHaveLength(3);
    for (const decorativeElement of ecosystemSection.querySelectorAll(
      "[data-ecosystem-flow-line], [data-ecosystem-flow-node]",
    )) {
      expect(decorativeElement).toHaveAttribute("aria-hidden", "true");
    }

    const stages = ecosystemSection.querySelectorAll(
      "[data-ecosystem-flow-stage]",
    );
    expect(stages[0]).not.toHaveClass("border-t-2", "border-primary");
    expect(stages[1]?.querySelector("[data-ecosystem-flow-node]")).toHaveClass(
      "bg-primary/90",
    );
    expect(stages[0]?.querySelector("[data-ecosystem-flow-node]")).toHaveClass(
      "bg-primary/60",
    );
    expect(stages[2]?.querySelector("[data-ecosystem-flow-node]")).toHaveClass(
      "bg-primary/60",
    );
    expect(
      within(ecosystemSection).getByText(
        "Los sitios de Uruguay y Argentina comunican el servicio y acompañan la captación comercial de cada mercado.",
      ),
    ).toBeInTheDocument();
    expect(
      within(ecosystemSection).getByText(
        "Un único punto de acceso ofrece experiencias diferenciadas según el rol y el contexto operativo de cada usuario.",
      ),
    ).toBeInTheDocument();
    expect(
      within(ecosystemSection).getByText(
        "La plataforma acompaña procesos de recepción de paquetes, evidencia fotográfica, peso, asignación, consolidación en cajas, embarques, tracking y actualización de estados.",
      ),
    ).toBeInTheDocument();

    const audiencesHeading = screen.getByRole("heading", {
      level: 2,
      name: "Experiencias según cada necesidad",
    });
    const audiencesSection = audiencesHeading.closest("section");
    expect(audiencesSection).toHaveClass(
      "bg-neutral",
      "px-4",
      "py-12",
      "text-gray-900",
      "sm:px-6",
      "sm:py-24",
    );
    expect(
      audiencesSection?.querySelectorAll(
        ".border-t-2.border-primary-on-light.pt-5",
      ),
    ).toHaveLength(3);
    expect(
      within(audiencesSection as HTMLElement).getByText(
        "Cada persona accede a la información y las acciones necesarias para su parte de la operación.",
      ),
    ).toHaveAttribute("data-audiences-intro");
    expect(
      within(audiencesSection as HTMLElement).getByText(
        "Consultan sus paquetes, tracking, fotografías, peso, cajas, embarques y estados operativos. También pueden informar un tracking esperado antes de que el paquete sea recibido.",
      ),
    ).toBeInTheDocument();
    expect(
      within(audiencesSection as HTMLElement).getByRole("heading", {
        level: 3,
        name: "Partner LEM-BOX",
      }),
    ).toBeInTheDocument();
    expect(
      within(audiencesSection as HTMLElement).getByText(
        "Administra una cartera asignada de clientes desde una sola cuenta. Puede crear y mantener registros asociados y consultar sus trackings, cajas y embarques dentro de una experiencia multi-cliente.",
      ),
    ).toBeInTheDocument();
    expect(
      within(audiencesSection as HTMLElement).getByText(
        "Registra paquetes, peso y evidencia fotográfica, asigna paquetes a clientes, consolida cajas, organiza embarques y actualiza estados para acompañar cada etapa del recorrido.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the LEM-BOX technical layout and stack with refined copy", async () => {
    renderApp("/portfolio/lem-box");

    const solutionHeading = await screen.findByRole("heading", {
      level: 2,
      name: "De procesos dispersos a un producto conectado",
    });
    const architectureHeading = screen.getByRole("heading", {
      level: 2,
      name: "Base técnica",
    });
    const solutionSection = solutionHeading.closest("section");
    const architectureSection = architectureHeading.closest("section");
    expect(solutionSection).not.toBeNull();
    expect(architectureSection).not.toBeNull();
    if (solutionSection === null || architectureSection === null) {
      throw new Error("Missing LEM-BOX solution or architecture section");
    }

    const columns = architectureSection.parentElement;
    expect(columns).toBe(solutionSection.parentElement);
    expect(columns).toHaveClass(
      "grid",
      "lg:grid-cols-2",
      "lg:gap-12",
    );
    expect(architectureSection).toHaveClass(
      "border-t",
      "border-white/15",
      "pt-7",
    );
    expect(
      within(solutionSection).getByText(
        "Diseñé y desarrollé una plataforma central conectada con las superficies comerciales de cada mercado. El resultado es un ecosistema donde la información acompaña el recorrido desde la captación hasta la operación y el seguimiento.",
      ),
    ).toBeInTheDocument();
    expect(
      within(architectureSection).getByText(
        "La arquitectura combina interfaces web, autenticación, datos, archivos y despliegues en una base preparada para evolucionar junto con el producto.",
      ),
    ).toBeInTheDocument();

    const stackLabel = within(architectureSection).getByRole("heading", {
      level: 3,
      name: "Tecnologías principales",
    });
    expect(stackLabel).toHaveClass(
      "uppercase",
      "tracking-[0.14em]",
      "text-primary",
    );
    const stackList = within(architectureSection).getByRole("list");
    expect(stackList).toHaveClass(
      "grid",
      "sm:grid-flow-col",
      "sm:grid-rows-4",
      "sm:gap-x-8",
    );
    expect(
      within(stackList)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase Authentication",
      "Cloud Firestore",
      "Firebase Storage",
      "Vercel",
    ]);
    expect(architectureSection.querySelector("img")).toBeNull();
  });

  it("integrates the LEM-BOX status into the refined markets and evolution flow", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio/lem-box");

    const marketsHeading = await screen.findByRole("heading", {
      level: 2,
      name: "Una operación, tres mercados",
    });
    const marketsSection = marketsHeading.closest("section");
    const evolutionHeading = screen.getByRole("heading", {
      level: 2,
      name: "Un producto que evoluciona con la operación",
    });
    const evolutionSection = evolutionHeading.closest("section");
    expect(marketsSection).not.toBeNull();
    expect(evolutionSection).not.toBeNull();
    if (marketsSection === null || evolutionSection === null) {
      throw new Error("Missing LEM-BOX markets or evolution section");
    }

    expect(
      within(marketsSection).getByText(
        "La operación logística se desarrolla en Estados Unidos, mientras Uruguay y Argentina cuentan con experiencias comerciales adaptadas a cada mercado y conectadas al mismo ecosistema operativo.",
      ),
    ).toBeInTheDocument();
    expect(
      within(evolutionSection).getByText(
        "ESTADO ACTUAL · PRODUCTO ACTIVO",
      ),
    ).toHaveAttribute("data-evolution-status-metadata");
    expect(
      within(evolutionSection).getByText(
        "LEM-BOX continúa adaptándose a los procesos, necesidades y prioridades reales del negocio.",
      ),
    ).toBeInTheDocument();
    expect(
      within(evolutionSection).getByText(
        "LEM-BOX cuenta con autenticación, controles de autorización según el perfil y pruebas automatizadas. Su documentación, sus validaciones y la calidad técnica continúan evolucionando.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Siguiente etapa" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "La plataforma web continúa activa y sigue evolucionando con documentación, pruebas y mejoras técnicas. Se evalúa una futura experiencia móvil para clientes. No hay una aplicación para Android o iOS disponible actualmente.",
      ),
    ).toBeInTheDocument();
    expect(document.querySelector("#lem-box-current-state")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Estado actual" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "One operation, three markets",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The logistics operation is based in the United States, while Uruguay and Argentina have commercial experiences tailored to each market and connected to the same operational ecosystem.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("CURRENT STATUS · ACTIVE PRODUCT"),
    ).toHaveAttribute("data-evolution-status-metadata");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "A product that evolves with the operation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "LEM-BOX includes authentication, profile-based authorization controls, and automated tests. Its documentation, validation practices, and technical quality continue to evolve.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Next stage" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Current status" })).toBeNull();
  });

  it("renders the English LEM-BOX case study and exact metadata", async () => {
    renderApp("/en/portfolio/lem-box");

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
        "The operation needed continuity across customer acquisition, package intake and consolidation, shipments, tracking, and support. The challenge was not to build an isolated website, but to connect markets, users, and processes through a product aligned with the real operation.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "My work starts with day-to-day operations: I turn real needs into product priorities, workflows, and features, and carry those decisions through implementation and the ecosystem's technical evolution.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The Uruguay and Argentina websites communicate the service and support customer acquisition in each market.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A single access point provides different experiences based on each user's role and operational context.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The platform supports package intake, photo evidence, weight, assignment, box consolidation, shipments, tracking, and status updates.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Each person accesses the information and actions needed for their part of the operation.",
      ),
    ).toHaveAttribute("data-audiences-intro");
    expect(
      screen.getByText(
        "They can view their packages, tracking, photos, weight, boxes, shipments, and operational statuses. They can also report an expected tracking number before the package is received.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "They manage an assigned customer portfolio from a single account. They can create and maintain associated records and view their tracking, boxes, and shipments through a multi-customer experience.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "They register packages, weight, and photo evidence, assign packages to customers, consolidate boxes, organize shipments, and update statuses throughout the journey.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Technical foundation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The architecture combines web interfaces, authentication, data, files, and deployments on a foundation designed to evolve with the product.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Core technologies",
      }),
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

  it("keeps one route-owned metadata set for the LEM-BOX page", async () => {
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
    const lemBoxImage = screen.getByRole("img", {
      name: "Logo de LEM-BOX con el lema «Logística en Miami»",
    });
    expect(lemBoxImage).toHaveAttribute("src", "/img/lem-box-cover.png");
    expect(lemBoxImage).toHaveAttribute("width", "1200");
    expect(lemBoxImage).toHaveAttribute("height", "630");
    expect(lemBoxImage).toHaveAttribute("loading", "eager");
    expect(lemBoxImage).toHaveAttribute("fetchpriority", "high");
    expect(lemBoxImage).toHaveAttribute("decoding", "async");
    expect(lemBoxImage).toHaveClass("object-contain");

    const picture = lemBoxImage.closest("picture");
    expect(picture).not.toBeNull();
    if (picture === null) {
      throw new Error("Missing LEM-BOX picture");
    }
    expect(picture.querySelectorAll("img")).toHaveLength(1);
    const sources = Array.from(picture.querySelectorAll("source"));
    expect(sources.map((source) => source.getAttribute("type"))).toEqual([
      "image/avif",
      "image/webp",
    ]);
    for (const source of sources) {
      expect(source.getAttribute("srcset")).toMatch(
        /lem-box-480\.(?:avif|webp) 480w, .*lem-box-768\.(?:avif|webp) 768w, .*lem-box-1200\.(?:avif|webp) 1200w/,
      );
      expect(source).toHaveAttribute(
        "sizes",
        "(min-width: 1200px) 552px, (min-width: 768px) calc(50vw - 48px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)",
      );
    }
  });

  it("renders the LEM-BOX public links as a light editorial directory", async () => {
    const user = userEvent.setup();
    renderApp("/portfolio/lem-box");

    const heading = await screen.findByRole("heading", {
      level: 2,
      name: "Conocer el ecosistema",
    });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    if (section === null) {
      throw new Error("Missing LEM-BOX public links section");
    }

    expect(section).toHaveClass(
      "bg-neutral",
      "px-4",
      "py-12",
      "text-gray-900",
      "sm:px-6",
      "sm:py-24",
    );
    expect(within(section).getByText("ENLACES PÚBLICOS")).toHaveClass(
      "uppercase",
      "tracking-[0.14em]",
      "text-primary-on-light",
    );
    expect(
      within(section).getByText(
        "Accedé a la plataforma central y conocé la presencia comercial de LEM-BOX en Uruguay y Argentina.",
      ),
    ).toBeInTheDocument();

    const directory = section.querySelector("[data-public-links-directory]");
    expect(directory).toHaveClass(
      "grid",
      "lg:grid-cols-[minmax(0,0.39fr)_minmax(0,0.61fr)]",
      "lg:gap-16",
    );
    const rows = section.querySelectorAll("[data-public-link-row]");
    expect(rows).toHaveLength(3);
    expect(section.querySelectorAll("[data-public-link-domain]")).toHaveLength(
      3,
    );
    expect(section.querySelector("img")).toBeNull();
    expect(section.querySelector('[class*="rounded"]')).toBeNull();
    expect(section.querySelector('[class*="shadow"]')).toBeNull();

    const spanishLinks = [
      {
        name: "Plataforma central lem-box.com Plataforma operativa privada. Acceso reservado a clientes, Partners y equipo autorizado de LEM-BOX. Abrir plataforma",
        href: "https://lem-box.com",
      },
      {
        name: "Uruguay lem-box.com.uy Sitio comercial para Uruguay Visitar sitio",
        href: "https://lem-box.com.uy",
      },
      {
        name: "Argentina lem-box.com.ar Sitio comercial para Argentina Visitar sitio",
        href: "https://lem-box.com.ar",
      },
    ];
    for (const expectedLink of spanishLinks) {
      const link = within(section).getByRole("link", {
        name: expectedLink.name,
      });
      expect(link).toHaveAttribute("href", expectedLink.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveClass(
        "min-h-[44px]",
        "border-t",
        "focus-visible:ring-2",
        "focus-visible:ring-inset",
      );
      expect(link.querySelector("a")).toBeNull();
    }

    const finalCtaHeading = screen.getByRole("heading", {
      level: 2,
      name: "¿Necesitás un sistema conectado a una operación real?",
    });
    const finalCta = finalCtaHeading.closest("section");
    expect(finalCta).not.toBeNull();
    if (finalCta === null) {
      throw new Error("Missing LEM-BOX final CTA section");
    }
    expect(finalCta).toHaveClass(
      "px-4",
      "py-16",
      "text-center",
      "sm:px-6",
      "sm:py-20",
    );
    expect(
      within(finalCta).getByText(
        "Contame el contexto y vemos cuál puede ser el mejor punto de partida.",
      ),
    ).toBeInTheDocument();
    expect(
      within(finalCta).getByRole("link", {
        name: "Contame tu proyecto",
      }),
    ).toHaveAttribute("href", "/#contacto");
    expect(screen.getByRole("contentinfo")).toHaveClass(
      "border-t",
      "border-gray-200",
      "bg-white",
      "py-3",
      "px-4",
      "sm:px-6",
    );

    await user.click(screen.getByRole("button", { name: "Cambiar a inglés" }));

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Explore the ecosystem",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("PUBLIC LINKS")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Access the central platform and explore LEM-BOX's commercial presence in Uruguay and Argentina.",
      ),
    ).toBeInTheDocument();
    for (const expectedName of [
      "Central platform lem-box.com Private operations platform. Access restricted to LEM-BOX customers, Partners, and authorized team members. Open platform",
      "Uruguay lem-box.com.uy Commercial website for Uruguay Visit website",
      "Argentina lem-box.com.ar Commercial website for Argentina Visit website",
    ]) {
      expect(
        screen.getByRole("link", { name: expectedName }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Need a system connected to a real operation?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Share the context and we'll identify the best place to start.",
      ),
    ).toBeInTheDocument();
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

  it("keeps the 404 footer at the viewport bottom through normal flow", async () => {
    renderApp("/ruta-inexistente");

    const heading = await screen.findByRole("heading", {
      level: 1,
      name: "Página no encontrada",
    });
    const main = heading.closest("main");
    const shell = main?.parentElement;
    const footer = screen.getByRole("contentinfo");

    expect(main).toHaveClass("flex-1");
    expect(shell).toHaveClass("min-h-screen", "flex", "flex-col");
    expect(shell).toHaveStyle({ minHeight: "100dvh" });
    expect(footer.parentElement).toBe(shell);
    expect(shell).not.toHaveClass("fixed", "sticky", "absolute");
    expect(main).not.toHaveClass("fixed", "sticky", "absolute");
    expect(footer).not.toHaveClass("fixed", "sticky", "absolute");
  });

  it("uses the default Spanish 404 for unregistered paths", async () => {
    renderApp("/en/missing-page");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Página no encontrada",
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
