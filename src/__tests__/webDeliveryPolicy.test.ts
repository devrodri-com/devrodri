import { describe, expect, it, vi } from "vitest";

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

interface VercelConfiguration {
  headers: HeaderRule[];
  rewrites: RewriteRule[];
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const path = await vi.importActual<PathApi>("node:path");
const url = await vi.importActual<UrlApi>("node:url");

const testDirectory = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.join(testDirectory, "../..");
const vercelConfigurationPath = path.join(projectRoot, "vercel.json");

const expectedSecurityHeaders = new Map([
  ["x-content-type-options", "nosniff"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  [
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  ],
  ["x-frame-options", "DENY"],
  [
    "content-security-policy",
    "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://formsubmit.co",
  ],
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

function parseVercelConfiguration(value: unknown): VercelConfiguration | null {
  if (!isRecord(value)) return null;
  if (!Array.isArray(value.headers) || !Array.isArray(value.rewrites)) {
    return null;
  }

  const parsedHeaders = value.headers.map(parseHeaderRule);
  const parsedRewrites = value.rewrites.map(parseRewriteRule);

  if (
    parsedHeaders.some((rule) => rule === null) ||
    parsedRewrites.some((rule) => rule === null)
  ) {
    return null;
  }

  return {
    headers: parsedHeaders.filter(
      (rule): rule is HeaderRule => rule !== null,
    ),
    rewrites: parsedRewrites.filter(
      (rule): rule is RewriteRule => rule !== null,
    ),
  };
}

describe("web delivery policy", () => {
  it("keeps the approved security, cache, and SPA delivery rules", () => {
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
    expect(contentSecurityPolicy).toBe(
      "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://formsubmit.co",
    );
    expect(contentSecurityPolicy).toContain("base-uri 'self'");
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
    expect(contentSecurityPolicy).toContain(
      "form-action 'self' https://formsubmit.co",
    );

    const normalizedPolicy = contentSecurityPolicy?.toLowerCase() ?? "";
    for (const forbiddenValue of [
      "*",
      "unsafe-inline",
      "unsafe-eval",
      "default-src",
      "script-src",
      "style-src",
    ]) {
      expect(normalizedPolicy).not.toContain(forbiddenValue);
    }

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

    expect(configuration.rewrites).toEqual([
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ]);
    expect(new RegExp(`^${configuration.rewrites[0]?.source}$`).test("/portfolio"))
      .toBe(true);
  });
});
