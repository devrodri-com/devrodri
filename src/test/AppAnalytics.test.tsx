import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { LanguageProvider } from "../i18n/LanguageProvider";
import {
  isAnalyticsClickLabel,
  trackAnalyticsClick,
  trackPageView,
} from "../lib/analytics";

vi.mock("../lib/analytics", () => ({
  isAnalyticsClickLabel: vi.fn(() => false),
  trackAnalyticsClick: vi.fn(),
  trackPageView: vi.fn(),
}));

function AnalyticsNavigationControls() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <button type="button" onClick={() => navigate("/portfolio")}>
        Analytics test Portfolio
      </button>
      <button type="button" onClick={() => navigate("/portfolio/lem-box")}>
        Analytics test Spanish case
      </button>
      <button type="button" onClick={() => navigate("/")}>
        Analytics test Home
      </button>
      <button type="button" onClick={() => navigate("/en")}>
        Analytics test English Home
      </button>
      <button type="button" onClick={() => navigate("/en/portfolio")}>
        Analytics test English Portfolio
      </button>
      <button
        type="button"
        onClick={() =>
          navigate({ pathname: location.pathname, search: "?source=test" })
        }
      >
        Analytics test query
      </button>
      <button
        type="button"
        onClick={() =>
          navigate({ pathname: location.pathname, hash: "#main-content" })
        }
      >
        Analytics test hash
      </button>
      <button
        type="button"
        onClick={() => navigate("/en/portfolio/lem-box")}
      >
        Analytics test English case
      </button>
      <button type="button" onClick={() => navigate("/en/no-existe")}>
        Analytics test English 404
      </button>
      <button type="button" onClick={() => navigate("/no-existe")}>
        Analytics test Spanish 404
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        Analytics test Back
      </button>
      <button type="button" onClick={() => navigate(1)}>
        Analytics test Forward
      </button>
    </div>
  );
}

describe("App analytics integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deduplicates the initial pageview under React StrictMode", async () => {
    render(
      <StrictMode>
        <LanguageProvider>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </LanguageProvider>
      </StrictMode>,
    );

    await waitFor(() => expect(trackPageView).toHaveBeenCalledTimes(1));
    expect(trackPageView).toHaveBeenCalledWith("/");
    expect(isAnalyticsClickLabel).not.toHaveBeenCalled();
    expect(trackAnalyticsClick).not.toHaveBeenCalled();
  });

  it("ignores a click whose EventTarget is not an Element", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/portfolio"]}>
          <App />
        </MemoryRouter>
      </LanguageProvider>,
    );
    await waitFor(() => expect(trackPageView).toHaveBeenCalledWith("/portfolio"));

    expect(() => {
      document.dispatchEvent(new Event("click", { bubbles: true }));
    }).not.toThrow();
    expect(isAnalyticsClickLabel).not.toHaveBeenCalled();
    expect(trackAnalyticsClick).not.toHaveBeenCalled();
  });

  it("tracks the exact LEM-BOX case pathname", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/portfolio/lem-box/"]}>
          <App />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() =>
      expect(trackPageView).toHaveBeenCalledWith("/portfolio/lem-box/"),
    );
  });

  it("tracks SPA route and language sequences once while ignoring query or hash-only changes", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
          <AnalyticsNavigationControls />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(trackPageView).toHaveBeenCalledTimes(1));
    await user.click(
      screen.getByRole("button", { name: "Analytics test Portfolio" }),
    );
    await waitFor(() => expect(trackPageView).toHaveBeenCalledTimes(2));

    await user.click(
      screen.getByRole("button", { name: "Analytics test query" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test hash" }),
    );
    expect(trackPageView).toHaveBeenCalledTimes(2);

    await user.click(
      screen.getByRole("button", { name: "Analytics test Spanish case" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test Home" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test English Home" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test English Portfolio" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test English case" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test Spanish case" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test Spanish 404" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test English Home" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test English 404" }),
    );

    await waitFor(() => {
      expect(vi.mocked(trackPageView).mock.calls).toEqual([
        ["/"],
        ["/portfolio"],
        ["/portfolio/lem-box"],
        ["/"],
        ["/en"],
        ["/en/portfolio"],
        ["/en/portfolio/lem-box"],
        ["/portfolio/lem-box"],
        ["/no-existe"],
        ["/en"],
        ["/en/no-existe"],
      ]);
    });
  });

  it("tracks Back and Forward pathname changes without duplicates", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/", "/portfolio"]} initialIndex={1}>
          <App />
          <AnalyticsNavigationControls />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(trackPageView).toHaveBeenCalledTimes(1));
    await user.click(
      screen.getByRole("button", { name: "Analytics test Back" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Analytics test Forward" }),
    );

    await waitFor(() => {
      expect(vi.mocked(trackPageView).mock.calls).toEqual([
        ["/portfolio"],
        ["/"],
        ["/portfolio"],
      ]);
    });
  });
});
