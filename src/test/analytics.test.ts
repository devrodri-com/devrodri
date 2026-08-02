import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const VALID_TEST_MEASUREMENT_ID = "G-TEST123456";
const GOOGLE_TAG_SCRIPT_ID = "devrodri-google-tag";

type ConfigCommand = Extract<
  GtagCommand,
  ["config", string, GoogleTagConfig]
>;
type PageViewCommand = Extract<
  GtagCommand,
  ["event", "page_view", AnalyticsPageViewParameters]
>;
type AnalyticsEventCommand = Extract<GtagCommand, ["event", string, unknown]>;
type SetPageLocationCommand = Extract<
  GtagCommand,
  ["set", "page_location", string]
>;

function dataLayerCommands(): GtagCommand[] {
  return (window.dataLayer ?? []).map(
    (entry) => Array.from(entry) as GtagCommand,
  );
}

function configCommands(): ConfigCommand[] {
  return dataLayerCommands().filter(
    (command): command is ConfigCommand => command[0] === "config",
  );
}

function pageViewCommands(): PageViewCommand[] {
  return dataLayerCommands().filter(
    (command): command is PageViewCommand =>
      command[0] === "event" && command[1] === "page_view",
  );
}

function analyticsEventCommands(): AnalyticsEventCommand[] {
  return dataLayerCommands().filter(
    (command): command is AnalyticsEventCommand => command[0] === "event",
  );
}

function pageLocationCommands(): SetPageLocationCommand[] {
  return dataLayerCommands().filter(
    (command): command is SetPageLocationCommand => command[0] === "set",
  );
}

describe("analytics", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    document.getElementById(GOOGLE_TAG_SCRIPT_ID)?.remove();
    Reflect.deleteProperty(window, "dataLayer");
    Reflect.deleteProperty(window, "gtag");
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each(["", "UA-12345", "G-invalid-value", "G-TOOSHORT"])(
    "degrades to a no-op for a missing or invalid measurement ID",
    async (measurementId) => {
      vi.stubEnv("VITE_GA_ID", measurementId);
      const { initializeAnalytics, trackPageView } = await import(
        "../lib/analytics"
      );

      expect(initializeAnalytics()).toBe(false);
      expect(() => trackPageView("/portfolio")).not.toThrow();
      expect(document.getElementById(GOOGLE_TAG_SCRIPT_ID)).toBeNull();
      expect(window.dataLayer).toBeUndefined();
    },
  );

  it("loads and configures Google tag exactly once", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    const { initializeAnalytics } = await import("../lib/analytics");

    expect(initializeAnalytics()).toBe(true);
    expect(initializeAnalytics()).toBe(true);

    expect(document.querySelectorAll(`#${GOOGLE_TAG_SCRIPT_ID}`)).toHaveLength(
      1,
    );
    expect(window.dataLayer).toHaveLength(3);
    expect(window.dataLayer?.every((entry) => !Array.isArray(entry))).toBe(true);
    expect(
      window.dataLayer?.every(
        (entry) => Object.prototype.toString.call(entry) === "[object Arguments]",
      ),
    ).toBe(true);
    expect(
      window.dataLayer?.every((entry) =>
        Object.prototype.hasOwnProperty.call(entry, "callee"),
      ),
    ).toBe(true);
    expect(configCommands()).toHaveLength(1);
    expect(configCommands()[0]?.[2]).toEqual({
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    expect(pageLocationCommands()).toEqual([
      ["set", "page_location", `${window.location.origin}/`],
    ]);
  });

  it.each([
    {
      path: "/",
      title: "Rodrigo Opalo | Sitios, sistemas y automatización",
    },
    {
      path: "/portfolio",
      title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
    },
    {
      path: "/portfolio/lem-box",
      title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    },
    {
      path: "/en",
      title: "Rodrigo Opalo | Websites, systems and automation",
    },
    {
      path: "/en/portfolio",
      title: "Portfolio: websites, systems and products | Rodrigo Opalo",
    },
    {
      path: "/en/portfolio/lem-box",
      title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    },
  ] as const)(
    "reports the canonical title for $path without an unknown bucket",
    async ({ path, title }) => {
      vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
      const { trackPageView } = await import("../lib/analytics");

      document.title = "Stale title from the previous route";
      trackPageView(path);

      expect(pageViewCommands()).toHaveLength(1);
      expect(pageViewCommands()[0]?.[2]).toMatchObject({
        page_location: `${window.location.origin}${path}`,
        page_path: path,
        page_title: title,
      });
      expect(JSON.stringify(dataLayerCommands())).not.toContain("/unknown");
    },
  );

  it("keeps allowlisted campaign attribution only on the first pageview", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    window.history.replaceState(
      null,
      "",
      "/?utm_source=google&utm_medium=cpc&utm_campaign=lanzamiento&email=privado%40example.com#contacto",
    );
    const { trackPageView } = await import("../lib/analytics");

    document.title = "Stale title before Home";
    trackPageView(window.location.pathname);

    window.history.replaceState(
      null,
      "",
      "/portfolio?utm_source=must-not-persist#sensitive",
    );
    document.title = "Stale title before Portfolio";
    trackPageView(window.location.pathname);

    expect(pageViewCommands()).toHaveLength(2);
    expect(pageViewCommands()[0]?.[2]).toEqual({
      page_title: "Rodrigo Opalo | Sitios, sistemas y automatización",
      page_location: `${window.location.origin}/?utm_source=google&utm_medium=cpc&utm_campaign=lanzamiento`,
      page_path: "/",
    });
    expect(pageViewCommands()[1]?.[2]).toEqual({
      page_title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
      page_location: `${window.location.origin}/portfolio`,
      page_path: "/portfolio",
    });
    expect(JSON.stringify(dataLayerCommands())).not.toContain(
      "privado@example.com",
    );
    expect(JSON.stringify(dataLayerCommands())).not.toContain("contacto");
    expect(JSON.stringify(dataLayerCommands())).not.toContain(
      "must-not-persist",
    );
    const cleanLocationCommands = pageLocationCommands();
    expect(cleanLocationCommands[cleanLocationCommands.length - 1]).toEqual([
      "set",
      "page_location",
      `${window.location.origin}/portfolio`,
    ]);
  });

  it("supports the complete campaign allowlist and excludes every other query", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    const campaignParameters = [
      "utm_id",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_source_platform",
      "utm_term",
      "utm_content",
      "utm_creative_format",
      "utm_marketing_tactic",
      "gclid",
      "dclid",
      "gbraid",
      "wbraid",
      "srsltid",
    ] as const;
    const campaignQuery = campaignParameters
      .map((key, index) => `${key}=value-${index}`)
      .join("&");
    window.history.replaceState(
      null,
      "",
      `/?${campaignQuery}&arbitrary=private#sensitive`,
    );
    const { trackPageView } = await import("../lib/analytics");

    trackPageView(window.location.pathname);

    const pageLocation = pageViewCommands()[0]?.[2].page_location;
    expect(pageLocation).toBe(`${window.location.origin}/?${campaignQuery}`);
    expect(pageLocation).not.toContain("arbitrary");
    expect(pageLocation).not.toContain("private");
    expect(pageLocation).not.toContain("#");
  });

  it.each([
    {
      locale: "es",
      sensitivePath: "/client/alice@example.com?token=private#message",
      title: "Página no encontrada | devrodri",
    },
    {
      locale: "en",
      sensitivePath: "/en/client/alice@example.com?token=private#message",
      title: "Page not found | devrodri",
    },
  ] as const)(
    "maps an unrecognized $locale path to the shared non-sensitive 404 analytics bucket",
    async ({ locale, sensitivePath, title }) => {
      vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
      window.history.replaceState(null, "", sensitivePath);
      const { trackContactAttempt, trackPageView } = await import(
        "../lib/analytics"
      );

      trackPageView(sensitivePath);
      trackContactAttempt(locale);

      const serializedCommands = JSON.stringify(dataLayerCommands());
      expect(serializedCommands).not.toContain("alice@example.com");
      expect(serializedCommands).not.toContain("token");
      expect(serializedCommands).not.toContain("private");
      expect(pageViewCommands()[0]?.[2]).toMatchObject({
        page_location: `${window.location.origin}/404`,
        page_path: "/404",
        page_title: title,
      });
      const events = analyticsEventCommands();
      expect(events[events.length - 1]?.[2]).toMatchObject({
        page_path: "/404",
      });
    },
  );

  it.each([
    "/portfolio/lem-box",
    "/portfolio/lem-box/",
    "/portfolio/lem-box///",
    "/portfolio/lem-box#private",
    "/portfolio/lem-box/?token=private#message",
  ])("normalizes the LEM-BOX case path without private suffixes: %s", async (path) => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    window.history.replaceState(null, "", path);
    const { trackPageView } = await import("../lib/analytics");

    trackPageView(path);

    expect(pageViewCommands()[0]?.[2]).toMatchObject({
      page_location: `${window.location.origin}/portfolio/lem-box`,
      page_path: "/portfolio/lem-box",
    });
    expect(JSON.stringify(dataLayerCommands())).not.toContain("private");
    expect(JSON.stringify(dataLayerCommands())).not.toContain("token");
  });

  it("keeps allowlisted campaign attribution on a LEM-BOX landing page", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    window.history.replaceState(
      null,
      "",
      "/portfolio/lem-box?utm_source=google&utm_medium=cpc&email=private%40example.com#message",
    );
    const { trackPageView } = await import("../lib/analytics");

    trackPageView(window.location.pathname);

    expect(pageViewCommands()[0]?.[2]).toEqual({
      page_title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
      page_location: `${window.location.origin}/portfolio/lem-box?utm_source=google&utm_medium=cpc`,
      page_path: "/portfolio/lem-box",
    });
    expect(JSON.stringify(dataLayerCommands())).not.toContain(
      "private@example.com",
    );
    expect(JSON.stringify(dataLayerCommands())).not.toContain("message");
  });

  it("does not classify a nested LEM-BOX path as the approved case route", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    const nestedPath = "/portfolio/lem-box/private";
    window.history.replaceState(null, "", nestedPath);
    const { trackPageView } = await import("../lib/analytics");

    trackPageView(nestedPath);

    expect(pageViewCommands()[0]?.[2]).toMatchObject({
      page_location: `${window.location.origin}/404`,
      page_path: "/404",
    });
  });

  it("uses closed, PII-free contact events", async () => {
    vi.stubEnv("VITE_GA_ID", VALID_TEST_MEASUREMENT_ID);
    window.history.replaceState(null, "", "/portfolio?lead=private#contact");
    const {
      trackContactAttempt,
      trackContactError,
      trackContactSuccess,
      trackContactTimeout,
    } = await import("../lib/analytics");

    trackContactAttempt("es");
    trackContactSuccess("es");
    trackContactError("es", "provider_error");
    trackContactTimeout("es");

    const contactEvents = analyticsEventCommands().filter(
      (command) => command[1] !== "page_view",
    );
    expect(contactEvents.map((command) => command[1])).toEqual([
      "contact_form_attempt",
      "generate_lead",
      "contact_form_error",
      "contact_form_timeout",
    ]);

    for (const [, , parameters] of contactEvents) {
      expect(parameters).not.toHaveProperty("name");
      expect(parameters).not.toHaveProperty("email");
      expect(parameters).not.toHaveProperty("message");
      expect(parameters).not.toHaveProperty("endpoint");
      expect(parameters).not.toHaveProperty("response");
      expect(parameters).toMatchObject({
        language: "es",
        page_path: "/portfolio",
        method: "formsubmit",
      });
    }

    expect(contactEvents[2]?.[2]).toHaveProperty(
      "error_type",
      "provider_error",
    );
    expect(contactEvents[3]?.[2]).toHaveProperty("error_type", "timeout");
    expect(
      pageLocationCommands().every(
        (command) =>
          command[2] === `${window.location.origin}/portfolio` &&
          !command[2].includes("?") &&
          !command[2].includes("#"),
      ),
    ).toBe(true);
  });

  it("accepts only the approved click labels", async () => {
    const { isAnalyticsClickLabel } = await import("../lib/analytics");

    expect(isAnalyticsClickLabel("cta-start-project")).toBe(true);
    expect(isAnalyticsClickLabel("contact-submit")).toBe(false);
    expect(isAnalyticsClickLabel("visitor-provided-value")).toBe(false);
  });
});
