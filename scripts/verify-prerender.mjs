import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const serverDirectory = path.join(projectRoot, "dist-ssr");
const expectedRoutes = [
  {
    pathname: "/",
    file: "index.html",
    lang: "es",
    title: "Rodrigo Opalo | Diseñador y Desarrollador Web",
    content: "Sitios web que comunican y convierten.",
  },
  {
    pathname: "/portfolio",
    file: "portfolio/index.html",
    lang: "es",
    title: "Portfolio | Rodrigo Opalo",
    content: "Algunos trabajos",
  },
  {
    pathname: "/portfolio/lem-box",
    file: "portfolio/lem-box/index.html",
    lang: "es",
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    content: "Un producto conectado a una operación real",
  },
  {
    pathname: "/en",
    file: "en/index.html",
    lang: "en",
    title: "Rodrigo Opalo | Web Designer and Developer",
    content: "Websites built to communicate and convert.",
  },
  {
    pathname: "/en/portfolio",
    file: "en/portfolio/index.html",
    lang: "en",
    title: "Portfolio | Rodrigo Opalo",
    content: "Some Work",
  },
  {
    pathname: "/en/portfolio/lem-box",
    file: "en/portfolio/lem-box/index.html",
    lang: "en",
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    content: "A product connected to a real operation",
  },
];
const localePairs = [
  ["/", "/en"],
  ["/portfolio", "/en/portfolio"],
  ["/portfolio/lem-box", "/en/portfolio/lem-box"],
];
const suspenseFallbacks = [
  "Cargando portfolio…",
  "Loading portfolio…",
  "Cargando caso LEM-BOX…",
  "Loading LEM-BOX case study…",
];

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function canonical(pathname) {
  return `https://www.devrodri.com${pathname}`;
}

function sha256Source(value) {
  const digest = createHash("sha256").update(value).digest("base64");
  return `'sha256-${digest}'`;
}

function inlineScripts(html) {
  return [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
}

const vercelConfiguration = JSON.parse(
  await readFile(path.join(projectRoot, "vercel.json"), "utf8"),
);
const globalHeaderRule = vercelConfiguration.headers.find(
  (rule) => rule.source === "/(.*)",
);
assert.ok(globalHeaderRule, "Missing global Vercel header rule");
const contentSecurityPolicy =
  globalHeaderRule.headers.find(
    (header) => header.key.toLowerCase() === "content-security-policy",
  )?.value ?? "";
assert.notEqual(contentSecurityPolicy, "", "Missing Content-Security-Policy");

const routeDocuments = [];
const routeDocumentHashes = [];
for (const route of expectedRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  routeDocuments.push(html);
  routeDocumentHashes.push(
    createHash("sha256").update(html).digest("hex"),
  );

  assert.match(html, new RegExp(`<html lang="${route.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${route.title}</title>`));
  assert.ok(html.includes(`rel="canonical" href="${canonical(route.pathname)}"`));
  assert.ok(html.includes('name="description" content="'));
  assert.ok(html.includes('name="robots" content="index, follow"'));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(html.includes(`property="og:url" content="${canonical(route.pathname)}"`));
  assert.ok(html.includes('property="og:image"'));
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="630"'));
  assert.ok(html.includes('property="og:image:alt"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes('name="twitter:title"'));
  assert.ok(html.includes('name="twitter:description"'));
  assert.ok(html.includes('name="twitter:image"'));
  assert.ok(html.includes('name="twitter:image:alt"'));
  assert.equal(count(html, "<title"), 1);
  assert.equal(count(html, 'name="description"'), 1);
  assert.equal(count(html, 'name="robots"'), 1);
  assert.equal(count(html, 'rel="canonical"'), 1);
  assert.equal(count(html, 'rel="alternate"'), 3);
  for (const tagName of [
    'property="og:title"',
    'property="og:description"',
    'property="og:type"',
    'property="og:url"',
    'property="og:image"',
    'property="og:image:width"',
    'property="og:image:height"',
    'property="og:image:alt"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
    'name="twitter:image:alt"',
  ]) {
    assert.equal(count(html, tagName), 1, `${route.pathname}: ${tagName}`);
  }
  const localePair = localePairs.find((pair) => pair.includes(route.pathname));
  assert.ok(localePair, `Missing locale pair for ${route.pathname}`);
  const [spanishPath, englishPath] = localePair;
  assert.ok(
    html.includes(`hrefLang="es" href="${canonical(spanishPath)}"`),
    `${route.pathname}: Spanish alternate`,
  );
  assert.ok(
    html.includes(`hrefLang="en" href="${canonical(englishPath)}"`),
    `${route.pathname}: English alternate`,
  );
  assert.ok(
    html.includes(`hrefLang="x-default" href="${canonical(spanishPath)}"`),
    `${route.pathname}: x-default alternate`,
  );
  assert.ok(html.includes(route.content));
  assert.match(html, /<h1[\s>]/);
  assert.match(html, /<p[\s>]/);
  assert.match(html, /<a[\s>]/);
  assert.ok(html.includes('<div id="root"><div'));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("/unknown"));
  for (const fallback of suspenseFallbacks) {
    assert.ok(!html.includes(fallback), `${route.pathname}: ${fallback}`);
  }

  const scripts = inlineScripts(html);
  const expectedJsonLdCount =
    route.pathname === "/" || route.pathname === "/en" ? 2 : 0;
  assert.equal(scripts.length, expectedJsonLdCount, route.pathname);
  for (const [, jsonLd] of scripts) {
    assert.doesNotThrow(() => JSON.parse(jsonLd), route.pathname);
    assert.ok(
      contentSecurityPolicy.includes(sha256Source(jsonLd)),
      `${route.pathname}: JSON-LD CSP hash`,
    );
  }

  const assetReferences = [
    ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  assert.ok(assetReferences.length >= 2);
  for (const assetReference of assetReferences) {
    const assetPath = path.join(
      distDirectory,
      assetReference.replace(/^\/+/, ""),
    );
    assert.ok((await stat(assetPath)).isFile(), `${assetReference} is missing`);
  }
}

assert.equal(new Set(routeDocuments).size, expectedRoutes.length);
assert.equal(new Set(routeDocumentHashes).size, expectedRoutes.length);

const assetFiles = await readdir(path.join(distDirectory, "assets"));
assert.equal(
  assetFiles.filter((file) => /^PortfolioPage-.*\.js$/.test(file)).length,
  1,
);
assert.equal(
  assetFiles.filter((file) => /^LemBoxCasePage-.*\.js$/.test(file)).length,
  1,
);

const notFoundHtml = await readFile(
  path.join(distDirectory, "404.html"),
  "utf8",
);
assert.match(notFoundHtml, /<html lang="es"/);
assert.ok(notFoundHtml.includes("Página no encontrada"));
assert.ok(notFoundHtml.includes('name="robots" content="noindex, nofollow"'));
assert.equal(count(notFoundHtml, "<title"), 1);
assert.equal(count(notFoundHtml, 'name="description"'), 1);
assert.equal(count(notFoundHtml, 'name="robots"'), 1);
assert.equal(count(notFoundHtml, 'rel="canonical"'), 0);
assert.equal(count(notFoundHtml, 'rel="alternate"'), 0);
assert.equal(count(notFoundHtml, 'property="og:'), 0);
assert.equal(count(notFoundHtml, 'name="twitter:'), 0);
assert.equal(inlineScripts(notFoundHtml).length, 0);
assert.ok(notFoundHtml.includes("<main"));
assert.ok(!notFoundHtml.includes("Sitios web que comunican y convierten."));
assert.ok(!notFoundHtml.includes("Websites built to communicate and convert."));
assert.ok(!notFoundHtml.includes("<!--app-head-->"));
assert.ok(!notFoundHtml.includes("<!--app-html-->"));

const robots = await readFile(path.join(distDirectory, "robots.txt"), "utf8");
assert.equal(
  robots,
  [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://www.devrodri.com/sitemap.xml",
    "",
  ].join("\n"),
);

const sitemap = await readFile(path.join(distDirectory, "sitemap.xml"), "utf8");
assert.equal(count(sitemap, "<url>"), expectedRoutes.length);
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, location]) => location,
);
assert.equal(sitemapLocations.length, expectedRoutes.length);
for (const route of expectedRoutes) {
  assert.ok(sitemapLocations.includes(canonical(route.pathname)));
}
for (const forbidden of [
  "<lastmod>",
  "<priority>",
  "<changefreq>",
  "/404",
  "vercel.app",
]) {
  assert.ok(!sitemap.includes(forbidden));
}
assert.ok(sitemapLocations.every((location) => !/[?#]/.test(location)));

assert.equal(vercelConfiguration.outputDirectory, "dist");
assert.equal(vercelConfiguration.trailingSlash, false);
assert.deepEqual(vercelConfiguration.rewrites, []);
assert.ok(!JSON.stringify(vercelConfiguration).includes('"/index.html"'));

function configuredContentType(source) {
  const rule = vercelConfiguration.headers.find(
    (candidate) => candidate.source === source,
  );
  return rule?.headers.find(
    (header) => header.key.toLowerCase() === "content-type",
  )?.value;
}

assert.equal(
  configuredContentType("/robots.txt"),
  "text/plain; charset=utf-8",
);
assert.equal(
  configuredContentType("/sitemap.xml"),
  "application/xml; charset=utf-8",
);

await assert.rejects(
  stat(path.join(distDirectory, "es", "index.html")),
  (error) => error?.code === "ENOENT",
);
const serverFiles = await readdir(serverDirectory, { recursive: true });
assert.ok(
  serverFiles.every(
    (file) =>
      !String(file).startsWith("img/") &&
      !String(file).startsWith("videos/"),
  ),
);

console.log(
  `Verified ${expectedRoutes.length} route documents, metadata, CSP, 404, robots and sitemap`,
);
