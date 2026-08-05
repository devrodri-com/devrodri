import { describe, expect, it, vi } from "vitest";
import {
  STRUCTURED_DATA_BY_ROUTE,
} from "../seo/structuredData";

interface FileSystemApi {
  readFileSync(path: string, encoding: "utf8"): string;
}

interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
}

interface UrlApi {
  fileURLToPath(url: string): string;
}

interface HashApi {
  update(value: string): HashApi;
  digest(encoding: "base64"): string;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

interface HeaderEntry {
  key: string;
  value: string;
}

interface HeaderRule {
  source: string;
  headers: HeaderEntry[];
}

interface RewriteRule {
  source: string;
  destination: string;
}

interface FileSystemRouteRule {
  handle: "filesystem";
}

interface NotFoundRouteRule {
  caseSensitive?: boolean;
  dest: string;
  headers: Record<string, string>;
  src: string;
  status: number;
}

type RouteRule = FileSystemRouteRule | NotFoundRouteRule;

interface VercelConfiguration {
  headers: HeaderRule[];
  outputDirectory: string;
  rewrites: RewriteRule[];
  routes: RouteRule[];
  trailingSlash: boolean;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const path = await vi.importActual<PathApi>("node:path");
const url = await vi.importActual<UrlApi>("node:url");
const crypto = await vi.importActual<CryptoApi>("node:crypto");

const testDirectory = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.join(testDirectory, "../..");
const vercelConfigurationPath = path.join(projectRoot, "vercel.json");
const indexHtmlPath = path.join(projectRoot, "index.html");

const contentSecurityPolicyBeforeCleanup =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://formsubmit.co; script-src 'self' https://www.googletagmanager.com 'sha256-O8l3yTyim5wlcCf0NH8eooMDbrLdmZb7wspJwSqm1F8=' 'sha256-14RAKb0fSoF/0NrAPsGFzhEcabDY08YgW52+HTiwOC8=' 'sha256-5JAfEolKKBpyKuNkJyFVP4QM03AqudwLaL6W4YE9Dow=' 'sha256-MWbnLG8L270wPoFC3v581s2nVNl/XC/TRKETtAkKpjY='; script-src-attr 'none'; style-src 'self' https://fonts.googleapis.com; style-src-attr 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://*.google-analytics.com https://www.googletagmanager.com; media-src 'self'; connect-src 'self' https://formsubmit.co https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'none'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests";

const contentSecurityPolicyBeforeNoJavaScript =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://formsubmit.co; script-src 'self' https://www.googletagmanager.com 'sha256-O8l3yTyim5wlcCf0NH8eooMDbrLdmZb7wspJwSqm1F8=' 'sha256-14RAKb0fSoF/0NrAPsGFzhEcabDY08YgW52+HTiwOC8=' 'sha256-5JAfEolKKBpyKuNkJyFVP4QM03AqudwLaL6W4YE9Dow=' 'sha256-MWbnLG8L270wPoFC3v581s2nVNl/XC/TRKETtAkKpjY='; script-src-attr 'none'; style-src 'self'; style-src-attr 'unsafe-inline'; font-src 'self'; img-src 'self' https://*.google-analytics.com https://www.googletagmanager.com; media-src 'self'; connect-src 'self' https://formsubmit.co https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'none'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests";

const noJavaScriptStyle =
  "[data-nojs-visible]{opacity:1!important;transform:none!important}[data-nojs-hide]{display:none!important}[data-nojs-language]{display:flex!important}@media(max-width:639px){[data-nojs-navbar]{position:static!important}[data-nojs-mobile-nav]{display:flex!important}}";
const noJavaScriptStyleHash =
  "'sha256-F3e8uFPgP10pK68RX7B5e1ZHd++LBK67gz3K7SNPrgA='";
const previousNoJavaScriptStyleHash =
  "'sha256-s8Yo+QmbhprPrMTPA+WlxksKujTWurQ8EScEm2yFeM4='";
const noJavaScriptBlock =
  `<noscript><style>${noJavaScriptStyle}</style></noscript>`;

const expectedContentSecurityPolicy =
  "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://formsubmit.co; script-src 'self' https://www.googletagmanager.com 'sha256-O8l3yTyim5wlcCf0NH8eooMDbrLdmZb7wspJwSqm1F8=' 'sha256-14RAKb0fSoF/0NrAPsGFzhEcabDY08YgW52+HTiwOC8=' 'sha256-5JAfEolKKBpyKuNkJyFVP4QM03AqudwLaL6W4YE9Dow=' 'sha256-MWbnLG8L270wPoFC3v581s2nVNl/XC/TRKETtAkKpjY='; script-src-attr 'none'; style-src 'self' 'sha256-F3e8uFPgP10pK68RX7B5e1ZHd++LBK67gz3K7SNPrgA='; style-src-attr 'unsafe-inline'; font-src 'self'; img-src 'self' https://*.google-analytics.com https://www.googletagmanager.com; media-src 'self'; connect-src 'self' https://formsubmit.co https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'none'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests";

const publishedStructuredData = [
  STRUCTURED_DATA_BY_ROUTE["home:es"],
  STRUCTURED_DATA_BY_ROUTE["home:en"],
  STRUCTURED_DATA_BY_ROUTE["lem-box:es"],
  STRUCTURED_DATA_BY_ROUTE["lem-box:en"],
] as const;

const expectedSecurityHeaders = new Map([
  ["x-content-type-options", "nosniff"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  [
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  ],
  ["x-frame-options", "DENY"],
  ["content-security-policy", expectedContentSecurityPolicy],
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseHeaderEntry(value: unknown): HeaderEntry | null {
  if (!isRecord(value)) return null;

  const key = value.key;
  const headerValue = value.value;

  return typeof key === "string" && typeof headerValue === "string"
    ? { key, value: headerValue }
    : null;
}

function parseHeaderRule(value: unknown): HeaderRule | null {
  if (!isRecord(value) || typeof value.source !== "string") return null;
  if (!Array.isArray(value.headers)) return null;

  const parsedHeaders = value.headers.map(parseHeaderEntry);
  if (parsedHeaders.some((header) => header === null)) return null;

  return {
    source: value.source,
    headers: parsedHeaders.filter(
      (header): header is HeaderEntry => header !== null,
    ),
  };
}

function parseRewriteRule(value: unknown): RewriteRule | null {
  if (
    !isRecord(value) ||
    typeof value.source !== "string" ||
    typeof value.destination !== "string"
  ) {
    return null;
  }

  return {
    source: value.source,
    destination: value.destination,
  };
}

function parseRouteRule(value: unknown): RouteRule | null {
  if (!isRecord(value)) return null;

  if (value.handle === "filesystem") {
    return { handle: "filesystem" };
  }

  if (!isRecord(value.headers)) return null;
  const parsedHeaders: Record<string, string> = {};
  for (const [key, headerValue] of Object.entries(value.headers)) {
    if (typeof headerValue !== "string") return null;
    parsedHeaders[key] = headerValue;
  }
  if (Object.keys(parsedHeaders).length === 0) return null;

  if (
    typeof value.src !== "string" ||
    typeof value.dest !== "string" ||
    typeof value.status !== "number" ||
    value.continue !== undefined ||
    (value.caseSensitive !== undefined &&
      typeof value.caseSensitive !== "boolean")
  ) {
    return null;
  }

  return {
    ...(value.caseSensitive === undefined
      ? {}
      : { caseSensitive: value.caseSensitive }),
    dest: value.dest,
    headers: parsedHeaders,
    src: value.src,
    status: value.status,
  };
}

function parseVercelConfiguration(value: unknown): VercelConfiguration | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.outputDirectory !== "string" ||
    typeof value.trailingSlash !== "boolean"
  ) {
    return null;
  }
  if (
    !Array.isArray(value.headers) ||
    !Array.isArray(value.rewrites) ||
    !Array.isArray(value.routes)
  ) {
    return null;
  }

  const parsedHeaders = value.headers.map(parseHeaderRule);
  const parsedRewrites = value.rewrites.map(parseRewriteRule);
  const parsedRoutes = value.routes.map(parseRouteRule);

  if (
    parsedHeaders.some((rule) => rule === null) ||
    parsedRewrites.some((rule) => rule === null) ||
    parsedRoutes.some((rule) => rule === null)
  ) {
    return null;
  }

  return {
    headers: parsedHeaders.filter(
      (rule): rule is HeaderRule => rule !== null,
    ),
    outputDirectory: value.outputDirectory,
    rewrites: parsedRewrites.filter(
      (rule): rule is RewriteRule => rule !== null,
    ),
    routes: parsedRoutes.filter(
      (rule): rule is RouteRule => rule !== null,
    ),
    trailingSlash: value.trailingSlash,
  };
}

function parseContentSecurityPolicy(
  policy: string,
): Map<string, readonly string[]> {
  return new Map(
    policy.split(";").map((directive) => {
      const [name = "", ...sources] = directive.trim().split(/\s+/);
      return [name, sources] as const;
    }),
  );
}

function diffContentSecurityPolicy(
  before: ReadonlyMap<string, readonly string[]>,
  after: ReadonlyMap<string, readonly string[]>,
): Array<{ change: "added" | "removed"; directive: string; source: string }> {
  const directiveNames = new Set([...before.keys(), ...after.keys()]);

  return [...directiveNames].flatMap((directive) => {
    const beforeSources = before.get(directive) ?? [];
    const afterSources = after.get(directive) ?? [];

    return [
      ...beforeSources
        .filter((source) => !afterSources.includes(source))
        .map((source) => ({ change: "removed" as const, directive, source })),
      ...afterSources
        .filter((source) => !beforeSources.includes(source))
        .map((source) => ({ change: "added" as const, directive, source })),
    ];
  });
}

function sha256Source(value: string): string {
  const digest = crypto.createHash("sha256").update(value).digest("base64");
  return `'sha256-${digest}'`;
}

describe("web delivery policy", () => {
  it("keeps the approved security, cache, and static delivery rules", () => {
    const source = fs.readFileSync(vercelConfigurationPath, "utf8");
    const parsedJson: unknown = JSON.parse(source);
    const configuration = parseVercelConfiguration(parsedJson);

    expect(configuration).not.toBeNull();
    if (configuration === null) {
      throw new Error("vercel.json does not match the expected configuration shape");
    }

    const globalRules = configuration.headers.filter(
      (rule) => rule.source === "/(.*)",
    );
    expect(globalRules).toHaveLength(1);

    const globalRule = globalRules[0];
    expect(globalRule).toBeDefined();
    if (globalRule === undefined) {
      throw new Error("The global header rule is missing");
    }

    const globalHeaders = new Map(
      globalRule.headers.map((header) => [
        header.key.toLowerCase(),
        header.value,
      ]),
    );

    expect(globalRule.headers).toHaveLength(expectedSecurityHeaders.size);
    expect(globalHeaders.size).toBe(globalRule.headers.length);
    expect(globalHeaders).toEqual(expectedSecurityHeaders);

    for (const [key, expectedValue] of expectedSecurityHeaders) {
      const matchingHeaders = configuration.headers.flatMap((rule) =>
        rule.headers.filter((header) => header.key.toLowerCase() === key),
      );

      expect(matchingHeaders).toEqual([
        {
          key: globalRule.headers.find(
            (header) => header.key.toLowerCase() === key,
          )?.key,
          value: expectedValue,
        },
      ]);
    }

    const contentSecurityPolicy = globalHeaders.get(
      "content-security-policy",
    );
    expect(contentSecurityPolicy).toBe(expectedContentSecurityPolicy);
    const directives = parseContentSecurityPolicy(
      contentSecurityPolicy ?? "",
    );
    const directivesBeforeCleanup = parseContentSecurityPolicy(
      contentSecurityPolicyBeforeCleanup,
    );
    const directivesBeforeNoJavaScript = parseContentSecurityPolicy(
      contentSecurityPolicyBeforeNoJavaScript,
    );

    expect([...directives.keys()]).toEqual([...directivesBeforeCleanup.keys()]);
    expect(
      diffContentSecurityPolicy(
        directivesBeforeCleanup,
        directivesBeforeNoJavaScript,
      ),
    ).toEqual([
      {
        change: "removed",
        directive: "style-src",
        source: "https://fonts.googleapis.com",
      },
      {
        change: "removed",
        directive: "font-src",
        source: "https://fonts.gstatic.com",
      },
    ]);
    expect(
      diffContentSecurityPolicy(directivesBeforeNoJavaScript, directives),
    ).toEqual([
      {
        change: "added",
        directive: "style-src",
        source: noJavaScriptStyleHash,
      },
    ]);

    expect(directives).toEqual(
      new Map([
        ["default-src", ["'self'"]],
        ["base-uri", ["'self'"]],
        ["object-src", ["'none'"]],
        ["frame-ancestors", ["'none'"]],
        ["form-action", ["'self'", "https://formsubmit.co"]],
        [
          "script-src",
          [
            "'self'",
            "https://www.googletagmanager.com",
            "'sha256-O8l3yTyim5wlcCf0NH8eooMDbrLdmZb7wspJwSqm1F8='",
            "'sha256-14RAKb0fSoF/0NrAPsGFzhEcabDY08YgW52+HTiwOC8='",
            "'sha256-5JAfEolKKBpyKuNkJyFVP4QM03AqudwLaL6W4YE9Dow='",
            "'sha256-MWbnLG8L270wPoFC3v581s2nVNl/XC/TRKETtAkKpjY='",
          ],
        ],
        ["script-src-attr", ["'none'"]],
        ["style-src", ["'self'", noJavaScriptStyleHash]],
        ["style-src-attr", ["'unsafe-inline'"]],
        ["font-src", ["'self'"]],
        [
          "img-src",
          [
            "'self'",
            "https://*.google-analytics.com",
            "https://www.googletagmanager.com",
          ],
        ],
        ["media-src", ["'self'"]],
        [
          "connect-src",
          [
            "'self'",
            "https://formsubmit.co",
            "https://www.googletagmanager.com",
            "https://*.google-analytics.com",
            "https://*.analytics.google.com",
          ],
        ],
        ["frame-src", ["'none'"]],
        ["manifest-src", ["'self'"]],
        ["worker-src", ["'none'"]],
        ["upgrade-insecure-requests", []],
      ]),
    );

    const allSources = [...directives.values()].flat();
    expect(allSources).not.toContain("*");
    expect(allSources).not.toContain("https:");

    const scriptSources = directives.get("script-src") ?? [];
    expect(scriptSources).not.toContain("'unsafe-inline'");
    expect(scriptSources).not.toContain("'unsafe-eval'");
    expect(scriptSources).not.toContain("data:");
    expect(scriptSources).toContain("https://www.googletagmanager.com");
    expect(
      scriptSources.filter((source) => source.startsWith("'sha256-")),
    ).toEqual(
      publishedStructuredData.map((structuredData) =>
        sha256Source(JSON.stringify(structuredData)),
      ),
    );
    expect(scriptSources).not.toContain(
      "'sha256-P01WC+VRcpA8HZ8Eg8qvHTell49g+1+ojplDsdfvSJY='",
    );
    expect(scriptSources).not.toContain(
      "'sha256-NGTPVuZtJv6KrQNvN78pj9Fz+4CuArpGSOhRfc3CjvI='",
    );
    expect(scriptSources).not.toContain(
      "'sha256-PFtIWoSjDUGI9FDBejrY6GsmT+jNY2fnEk/Wu0PMTxo='",
    );
    expect(scriptSources).not.toContain(
      "'sha256-NJsY0F2k7FEFgpKyakOXbgKzmylETn07jGhl+846ouI='",
    );

    expect(directives.get("form-action")).toContain("https://formsubmit.co");
    expect(directives.get("connect-src")).toContain("https://formsubmit.co");
    expect(directives.get("style-src")).not.toContain(
      "https://fonts.googleapis.com",
    );
    expect(directives.get("style-src")).toEqual([
      "'self'",
      noJavaScriptStyleHash,
    ]);
    expect(
      directives
        .get("style-src")
        ?.filter((source) => source === noJavaScriptStyleHash),
    ).toHaveLength(1);
    expect(directives.get("style-src")).not.toContain("'unsafe-inline'");
    expect(directives.get("style-src")).not.toContain("'unsafe-eval'");
    expect(directives.get("font-src")).not.toContain(
      "https://fonts.gstatic.com",
    );
    expect(directives.get("media-src")).toEqual(["'self'"]);
    expect(directives.get("img-src")).toContain("'self'");
    expect(directives.get("img-src")).not.toContain("data:");

    const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
    expect(new TextEncoder().encode(noJavaScriptStyle)).toHaveLength(265);
    expect(sha256Source(noJavaScriptStyle)).toBe(noJavaScriptStyleHash);
    expect(noJavaScriptStyle).toContain(
      "[data-nojs-hide]{display:none!important}",
    );
    expect(noJavaScriptStyle).toContain(
      "[data-nojs-language]{display:flex!important}",
    );
    expect(noJavaScriptStyle).toContain(
      "@media(max-width:639px){[data-nojs-navbar]{position:static!important}[data-nojs-mobile-nav]{display:flex!important}}",
    );
    expect(indexHtml.split(noJavaScriptBlock)).toHaveLength(2);
    expect(indexHtml).toContain(noJavaScriptBlock);
    expect(indexHtml.match(/<noscript>/g) ?? []).toHaveLength(1);
    expect(indexHtml.match(/<noscript><style>/g) ?? []).toHaveLength(1);
    expect(indexHtml).not.toContain("googletagmanager.com/gtag/js");
    expect(indexHtml).not.toContain("function gtag");
    expect(indexHtml).not.toMatch(/G-[A-Z0-9]{6,}/);
    expect(indexHtml.match(/rel="preconnect"/g) ?? []).toHaveLength(0);
    expect(indexHtml).not.toContain("fonts.googleapis.com");
    expect(indexHtml).not.toContain("fonts.gstatic.com");
    expect(indexHtml).not.toContain(previousNoJavaScriptStyleHash);
    expect(source).not.toContain(previousNoJavaScriptStyleHash);

    const cacheControlRules = configuration.headers.flatMap((rule) =>
      rule.headers
        .filter((header) => header.key.toLowerCase() === "cache-control")
        .map((header) => ({ source: rule.source, value: header.value })),
    );

    expect(cacheControlRules).toEqual([
      {
        source: "/assets/(.*)",
        value: "public, max-age=31536000, immutable",
      },
    ]);
    expect(
      cacheControlRules.some(({ source: ruleSource }) =>
        [
          "/",
          "/portfolio",
          "/index.html",
          "/img/(.*)",
          "/videos/(.*)",
          "/favicon.png",
        ].includes(ruleSource),
      ),
    ).toBe(false);

    const contentTypeRules = configuration.headers.flatMap((rule) =>
      rule.headers
        .filter((header) => header.key.toLowerCase() === "content-type")
        .map((header) => ({ source: rule.source, value: header.value })),
    );
    expect(contentTypeRules).toEqual([
      {
        source: "/robots.txt",
        value: "text/plain; charset=utf-8",
      },
      {
        source: "/sitemap.xml",
        value: "application/xml; charset=utf-8",
      },
    ]);

    expect(configuration.outputDirectory).toBe("dist");
    expect(configuration.trailingSlash).toBe(false);
    expect(configuration.rewrites).toEqual([]);
    const localizedNotFoundRouteSource =
      "/en/(?!(?:portfolio(?:/lem-box)?|services(?:/business-websites|/custom-software)?|thank-you)/?$).+$";
    const canonicalRouteSecurityHeaders = Object.fromEntries(
      globalRule.headers.map(({ key, value }) => [key, value]),
    );
    expect(configuration.routes).toEqual([
      {
        caseSensitive: true,
        dest: "/en/404.html",
        headers: canonicalRouteSecurityHeaders,
        src: localizedNotFoundRouteSource,
        status: 404,
      },
    ]);
    expect(source).not.toContain('"handle": "filesystem"');
    expect(
      source.match(/"Content-Security-Policy"\s*:/g) ?? [],
    ).toHaveLength(1);

    const [localizedNotFoundTerminalRoute] = configuration.routes;
    expect(localizedNotFoundTerminalRoute).toBeDefined();
    if (
      localizedNotFoundTerminalRoute === undefined ||
      !("dest" in localizedNotFoundTerminalRoute)
    ) {
      throw new Error("The localized 404 terminal route is missing");
    }
    expect(localizedNotFoundTerminalRoute.headers).toEqual(
      canonicalRouteSecurityHeaders,
    );
    for (const effectivePolicy of [
      contentSecurityPolicy,
      localizedNotFoundTerminalRoute.headers["Content-Security-Policy"],
    ]) {
      expect(effectivePolicy).toBe(expectedContentSecurityPolicy);
      if (effectivePolicy === undefined) {
        throw new Error("An effective CSP policy is missing");
      }
      expect(effectivePolicy.split(noJavaScriptStyleHash)).toHaveLength(2);
    }
    expect("continue" in localizedNotFoundTerminalRoute).toBe(false);
    expect(localizedNotFoundTerminalRoute.dest).toBe("/en/404.html");
    expect(localizedNotFoundTerminalRoute.status).toBe(404);
    expect(
      Object.keys(localizedNotFoundTerminalRoute.headers).filter(
        (key) => key.toLowerCase() === "content-security-policy",
      ),
    ).toHaveLength(1);
    const localizedNotFoundPattern = new RegExp(
      localizedNotFoundTerminalRoute.src,
    );
    expect([
      "/en",
      "/en/",
      "/en/portfolio",
      "/en/portfolio/",
      "/en/portfolio/lem-box",
      "/en/portfolio/lem-box/",
      "/en/services",
      "/en/services/",
      "/en/services/business-websites",
      "/en/services/business-websites/",
      "/en/services/custom-software",
      "/en/services/custom-software/",
      "/en/thank-you",
      "/en/thank-you/",
    ].some((pathname) => localizedNotFoundPattern.test(pathname))).toBe(false);
    expect([
      "/en/no-existe",
      "/en/portfolio/no-existe",
      "/en/services/no-existe",
    ].every((pathname) => localizedNotFoundPattern.test(pathname))).toBe(true);
    expect(source).not.toContain('"destination": "/index.html"');
  });
});
