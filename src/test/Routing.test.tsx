import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { LanguageProvider } from "../LanguageContext";

function renderApp(path: string) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>
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
  });

  it("loads the lazy portfolio route", async () => {
    renderApp("/portfolio");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Algunos trabajos",
      }),
    ).toBeInTheDocument();
  });

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
});
