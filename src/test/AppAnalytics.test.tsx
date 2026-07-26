import { render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { LanguageProvider } from "../LanguageContext";
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
});
