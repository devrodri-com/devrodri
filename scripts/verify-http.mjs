import assert from "node:assert/strict";
import { once } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const vercelConfiguration = JSON.parse(
  await readFile(path.join(projectRoot, "vercel.json"), "utf8"),
);
const globalHeaderRule = vercelConfiguration.headers.find(
  (rule) => rule.source === "/(.*)",
);
assert.ok(globalHeaderRule, "Missing global Vercel header rule");
const expectedSecurityHeaders = new Map(
  globalHeaderRule.headers.map((header) => [
    header.key.toLowerCase(),
    header.value,
  ]),
);
const serverProcess = spawn(process.execPath, ["scripts/serve-dist.mjs"], {
  cwd: projectRoot,
  env: { ...process.env, PORT: "0" },
  stdio: ["ignore", "pipe", "pipe"],
});

let stderr = "";
serverProcess.stderr.setEncoding("utf8");
serverProcess.stderr.on("data", (chunk) => {
  stderr += chunk;
});

let serverUrl;
try {
  serverUrl = await new Promise((resolve, reject) => {
    let stdout = "";
    const timeout = setTimeout(() => {
      reject(new Error(`Static server startup timed out.\n${stderr}`));
    }, 5_000);

    serverProcess.stdout.setEncoding("utf8");
    serverProcess.stdout.on("data", (chunk) => {
      stdout += chunk;
      const match = stdout.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match === null) return;
      clearTimeout(timeout);
      resolve(match[0]);
    });
    serverProcess.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    serverProcess.once("exit", (code) => {
      if (code === 0) return;
      clearTimeout(timeout);
      reject(
        new Error(`Static server exited with code ${code}.\n${stderr}`),
      );
    });
  });
} catch (error) {
  await stopServer();
  throw error;
}

async function request(pathname) {
  return fetch(`${serverUrl}${pathname}`, { redirect: "manual" });
}

function assertSecurityHeaders(response, pathname) {
  for (const [name, value] of expectedSecurityHeaders) {
    assert.equal(response.headers.get(name), value, `${pathname}: ${name}`);
  }
}

async function stopServer() {
  if (serverProcess.exitCode !== null) return;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Static server shutdown timed out")),
      2_000,
    );
    once(serverProcess, "exit").then(() => {
      clearTimeout(timeout);
      resolve();
    }, reject);
    serverProcess.kill("SIGTERM");
  });
}

try {
  const indexablePaths = [
    "/",
    "/portfolio",
    "/portfolio/lem-box",
    "/en",
    "/en/portfolio",
    "/en/portfolio/lem-box",
  ];
  for (const pathname of indexablePaths) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.equal(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
      pathname,
    );
    assertSecurityHeaders(response, pathname);
    const html = await response.text();
    assert.ok(html.includes('<div id="root"><div'), pathname);
    assert.ok(html.includes('name="robots" content="index, follow"'), pathname);
  }

  const thankYouPaths = new Map([
    [
      "/gracias",
      {
        lang: "es",
        title: "Consulta enviada | Rodrigo Opalo",
        heading: "Consulta enviada",
        copy:
          "Gracias por escribirme. Recibí tu consulta y te voy a responder lo antes posible.",
        cta: "Volver al inicio",
        ctaPath: "/",
      },
    ],
    [
      "/en/thank-you",
      {
        lang: "en",
        title: "Inquiry sent | Rodrigo Opalo",
        heading: "Inquiry sent",
        copy:
          "Thanks for getting in touch. I received your inquiry and will get back to you as soon as possible.",
        cta: "Back to home",
        ctaPath: "/en",
      },
    ],
  ]);
  for (const [pathname, expected] of thankYouPaths) {
    const response = await request(pathname);
    assert.equal(response.status, 200, pathname);
    assert.equal(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
      pathname,
    );
    assertSecurityHeaders(response, pathname);
    const html = await response.text();
    assert.ok(html.includes(`<html lang="${expected.lang}"`), pathname);
    assert.ok(
      html.includes(`<title data-rh="true">${expected.title}</title>`),
      pathname,
    );
    assert.ok(html.includes(expected.heading), pathname);
    assert.ok(html.includes(expected.copy), pathname);
    assert.ok(html.includes(expected.cta), pathname);
    assert.ok(html.includes(`href="${expected.ctaPath}"`), pathname);
    assert.ok(html.includes('<div id="root"><div'), pathname);
    assert.ok(
      html.includes('name="robots" content="noindex, nofollow"'),
      pathname,
    );
    assert.ok(!html.includes('rel="canonical"'), pathname);
    assert.ok(!html.includes('rel="alternate"'), pathname);
    assert.ok(!html.includes('property="og:'), pathname);
    assert.ok(!html.includes('name="twitter:'), pathname);
    assert.ok(!html.includes('type="application/ld+json"'), pathname);
    assert.ok(!html.includes("<form"), pathname);
  }

  const invalidPaths = new Map([
    [
      "/no-existe",
      {
        lang: "es",
        heading: "Página no encontrada",
        cta: "Volver al inicio",
        ctaPath: "/",
      },
    ],
    [
      "/portfolio/no-existe",
      {
        lang: "es",
        heading: "Página no encontrada",
        cta: "Volver al inicio",
        ctaPath: "/",
      },
    ],
    [
      "/en/no-existe",
      {
        lang: "en",
        heading: "Page not found",
        cta: "Back to home",
        ctaPath: "/en",
      },
    ],
    [
      "/en/portfolio/no-existe",
      {
        lang: "en",
        heading: "Page not found",
        cta: "Back to home",
        ctaPath: "/en",
      },
    ],
  ]);
  const invalidBodies = [];
  for (const [pathname, expected] of invalidPaths) {
    const response = await request(pathname);
    assert.equal(response.status, 404, pathname);
    assert.equal(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
      pathname,
    );
    assertSecurityHeaders(response, pathname);
    const html = await response.text();
    invalidBodies.push(html);
    assert.ok(html.includes(`<html lang="${expected.lang}"`), pathname);
    assert.ok(html.includes(expected.heading), pathname);
    assert.ok(html.includes(expected.cta), pathname);
    assert.ok(html.includes(`href="${expected.ctaPath}"`), pathname);
    assert.ok(
      html.includes('name="robots" content="noindex, nofollow"'),
      pathname,
    );
    assert.ok(!html.includes('rel="canonical"'), pathname);
    assert.ok(!html.includes('rel="alternate"'), pathname);
    assert.ok(!html.includes('property="og:'), pathname);
    assert.ok(!html.includes('name="twitter:'), pathname);
    assert.ok(!html.includes('type="application/ld+json"'), pathname);
    assert.ok(!html.includes("Sitios web que comunican y convierten."), pathname);
  }
  assert.equal(new Set(invalidBodies).size, 2);

  const trailingSlashRedirects = new Map([
    ["/portfolio/?source=vis01", "/portfolio?source=vis01"],
    [
      "/portfolio/lem-box/?source=vis01",
      "/portfolio/lem-box?source=vis01",
    ],
    ["/en/?source=vis01", "/en?source=vis01"],
    ["/en/portfolio/?source=vis01", "/en/portfolio?source=vis01"],
    [
      "/en/portfolio/lem-box/?source=vis01",
      "/en/portfolio/lem-box?source=vis01",
    ],
    ["/gracias/?source=vis01", "/gracias?source=vis01"],
    [
      "/en/thank-you/?source=vis01",
      "/en/thank-you?source=vis01",
    ],
  ]);
  for (const [pathname, expectedLocation] of trailingSlashRedirects) {
    const response = await request(pathname);
    assert.equal(response.status, 308, pathname);
    assert.equal(response.headers.get("location"), expectedLocation, pathname);

    const destination = await fetch(new URL(expectedLocation, serverUrl), {
      redirect: "manual",
    });
    assert.equal(destination.status, 200, expectedLocation);
  }

  const robotsResponse = await request("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  assert.equal(
    robotsResponse.headers.get("content-type"),
    "text/plain; charset=utf-8",
  );
  assert.equal(
    await robotsResponse.text(),
    [
      "User-agent: *",
      "Allow: /",
      "Sitemap: https://www.devrodri.com/sitemap.xml",
      "",
    ].join("\n"),
  );

  const sitemapResponse = await request("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  assert.equal(
    sitemapResponse.headers.get("content-type"),
    "application/xml; charset=utf-8",
  );
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemap.split("<url>").length - 1, indexablePaths.length);
  for (const pathname of indexablePaths) {
    assert.ok(
      sitemap.includes(`<loc>https://www.devrodri.com${pathname}</loc>`),
      pathname,
    );
  }
  assert.ok(!sitemap.includes("/gracias"));
  assert.ok(!sitemap.includes("/en/thank-you"));

  const homeHtml = await readFile(
    path.join(projectRoot, "dist", "index.html"),
    "utf8",
  );
  const referencedAssets = [
    ...homeHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  assert.ok(referencedAssets.length >= 2);
  for (const assetPath of new Set(referencedAssets)) {
    const response = await request(assetPath);
    assert.equal(response.status, 200, assetPath);
  }

  const assetFiles = await readdir(path.join(projectRoot, "dist", "assets"));
  const lazyChunks = assetFiles.filter((file) =>
    /^(PortfolioPage|LemBoxCasePage)-.*\.js$/.test(file),
  );
  assert.equal(lazyChunks.length, 2);
  for (const lazyChunk of lazyChunks) {
    const response = await request(`/assets/${lazyChunk}`);
    assert.equal(response.status, 200, lazyChunk);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^text\/javascript;/,
      lazyChunk,
    );
  }

  console.log(
    "Verified static HTTP routes, localized confirmations, redirects, MIME types, assets and 404 responses",
  );
} finally {
  await stopServer();
}
