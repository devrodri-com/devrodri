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
    title: "Rodrigo Opalo | Sitios, sistemas y automatización",
    description:
      "Desarrollo sitios, aplicaciones y sistemas a medida, además de automatizaciones e integraciones orientadas a objetivos reales de negocio.",
    content: "Sitios web que comunican y convierten.",
    noJavaScriptMarkers: 17,
  },
  {
    pathname: "/portfolio",
    file: "portfolio/index.html",
    lang: "es",
    title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
    description:
      "Explorá proyectos de sistemas, sitios web, e-commerce y estrategia de marca, con detalles de alcance, rol y tecnología.",
    content: "Algunos trabajos",
    noJavaScriptMarkers: 9,
  },
  {
    pathname: "/portfolio/lem-box",
    file: "portfolio/lem-box/index.html",
    lang: "es",
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    description:
      "Caso de producto propio: un ecosistema digital conectado con la operación logística de LEM-BOX en Estados Unidos, Uruguay y Argentina.",
    content: "Un producto conectado a una operación real",
    noJavaScriptMarkers: 1,
  },
  {
    pathname: "/en",
    file: "en/index.html",
    lang: "en",
    title: "Rodrigo Opalo | Websites, systems and automation",
    description:
      "I build custom websites, applications, and systems, plus automations and integrations aligned with real business goals.",
    content: "Websites built to communicate and convert.",
    noJavaScriptMarkers: 17,
  },
  {
    pathname: "/en/portfolio",
    file: "en/portfolio/index.html",
    lang: "en",
    title: "Portfolio: websites, systems and products | Rodrigo Opalo",
    description:
      "Explore systems, websites, e-commerce, and brand strategy projects with details on scope, role, and technology.",
    content: "Some Work",
    noJavaScriptMarkers: 9,
  },
  {
    pathname: "/en/portfolio/lem-box",
    file: "en/portfolio/lem-box/index.html",
    lang: "en",
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    description:
      "Own-product case study: a digital ecosystem connected to LEM-BOX's logistics operation across the United States, Uruguay, and Argentina.",
    content: "A product connected to a real operation",
    noJavaScriptMarkers: 1,
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
const expectedStructuredData = new Map([
  [
    "/",
    {
      types: ["WebSite", "Person", "EducationalOccupationalCredential"],
      ids: [
        "https://www.devrodri.com/#website",
        "https://www.devrodri.com/#person",
        "https://www.devrodri.com/#ibm-full-stack-credential",
      ],
    },
  ],
  [
    "/en",
    {
      types: ["WebSite", "Person", "EducationalOccupationalCredential"],
      ids: [
        "https://www.devrodri.com/#website",
        "https://www.devrodri.com/#person",
        "https://www.devrodri.com/#ibm-full-stack-credential",
      ],
    },
  ],
  [
    "/portfolio/lem-box",
    {
      types: ["CreativeWork", "WebApplication"],
      ids: [
        "https://www.devrodri.com/portfolio/lem-box#case-study",
        "https://www.devrodri.com/#lem-box-web-application",
      ],
    },
  ],
  [
    "/en/portfolio/lem-box",
    {
      types: ["CreativeWork", "WebApplication"],
      ids: [
        "https://www.devrodri.com/en/portfolio/lem-box#case-study",
        "https://www.devrodri.com/#lem-box-web-application",
      ],
    },
  ],
]);

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function canonical(pathname) {
  return `https://www.devrodri.com${pathname}`;
}

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function sha256Source(value) {
  const digest = createHash("sha256").update(value).digest("base64");
  return `'sha256-${digest}'`;
}

const noJavaScriptStyle =
  "[data-nojs-visible]{opacity:1!important;transform:none!important}[data-nojs-hide]{display:none!important}[data-nojs-language]{display:flex!important}@media(max-width:639px){[data-nojs-navbar]{position:static!important}[data-nojs-mobile-nav]{display:flex!important}}";
const noJavaScriptStyleHash =
  "'sha256-F3e8uFPgP10pK68RX7B5e1ZHd++LBK67gz3K7SNPrgA='";
const previousNoJavaScriptStyleHash =
  "'sha256-s8Yo+QmbhprPrMTPA+WlxksKujTWurQ8EScEm2yFeM4='";
const noJavaScriptBlock =
  `<noscript><style>${noJavaScriptStyle}</style></noscript>`;

function assertNoJavaScriptNavigation(
  html,
  { englishPath, lang, spanishPath },
) {
  const mobileFallbackStart = html.indexOf(
    '<div data-nojs-mobile-nav="true"',
  );
  assert.notEqual(mobileFallbackStart, -1, `${lang}: mobile fallback`);
  const mobileFallbackEnd = html.indexOf("</nav>", mobileFallbackStart);
  assert.notEqual(mobileFallbackEnd, -1, `${lang}: Navbar close`);
  const mobileFallback = html.slice(mobileFallbackStart, mobileFallbackEnd);
  const localizedHomePath = lang === "es" ? "/" : "/en";
  const localizedPortfolioPath = lang === "es"
    ? "/portfolio"
    : "/en/portfolio";
  const expectedNavigationHrefs = [
    `${localizedHomePath}#sobremi`,
    `${localizedHomePath}#porqueelegirnos`,
    localizedPortfolioPath,
    `${localizedHomePath}#contacto`,
    `${localizedHomePath}#faq`,
    spanishPath,
    englishPath,
  ];
  const fallbackAnchors = [
    ...mobileFallback.matchAll(/<a\b[^>]*>/g),
  ].map(([anchor]) => anchor);

  assert.equal(count(html, 'data-nojs-navbar="true"'), 1, `${lang}: Navbar`);
  assert.equal(
    count(html, 'data-nojs-mobile-nav="true"'),
    1,
    `${lang}: mobile fallback count`,
  );
  assert.equal(
    count(html, 'data-nojs-language="true"'),
    2,
    `${lang}: language fallback count`,
  );
  assert.equal(
    count(html, 'data-nojs-hide="true"'),
    2,
    `${lang}: JavaScript-only controls`,
  );
  assert.equal(
    count(html, 'aria-current="page"'),
    2,
    `${lang}: language current state`,
  );
  assert.ok(
    html.includes(
      `aria-label="${lang === "es" ? "Navegación principal" : "Primary navigation"}"`,
    ),
    `${lang}: localized navigation label`,
  );
  assert.ok(
    mobileFallback.includes(
      `aria-label="${lang === "es" ? "Selector de idioma" : "Language selector"}"`,
    ),
    `${lang}: localized language label`,
  );
  assert.ok(
    mobileFallback.includes(
      `aria-label="${lang === "es" ? "Español, idioma actual" : "English, current language"}"`,
    ),
    `${lang}: current language label`,
  );
  assert.equal(fallbackAnchors.length, expectedNavigationHrefs.length);
  assert.deepEqual(
    fallbackAnchors.map((anchor) =>
      anchor.match(/\shref="([^"]+)"/)?.[1]
    ),
    expectedNavigationHrefs,
    `${lang}: fallback hrefs`,
  );
  assert.ok(fallbackAnchors.every((anchor) => /\shref="[^"]+"/.test(anchor)));
  assert.equal(count(mobileFallback, "focus-visible:ring-2"), 7);
  assert.ok(!mobileFallback.includes("<button"));
  assert.ok(!mobileFallback.includes("aria-pressed"));
  assert.ok(!mobileFallback.includes("tabindex="));
}

function inlineScripts(html) {
  return [
    ...html.matchAll(
      /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
}

const vercelConfigurationSource = await readFile(
  path.join(projectRoot, "vercel.json"),
  "utf8",
);
const vercelConfiguration = JSON.parse(vercelConfigurationSource);
const globalHeaderRule = vercelConfiguration.headers.find(
  (rule) => rule.source === "/(.*)",
);
assert.ok(globalHeaderRule, "Missing global Vercel header rule");
const canonicalSecurityHeaders = Object.fromEntries(
  globalHeaderRule.headers.map((header) => [header.key, header.value]),
);
const contentSecurityPolicy =
  globalHeaderRule.headers.find(
    (header) => header.key.toLowerCase() === "content-security-policy",
  )?.value ?? "";
assert.notEqual(contentSecurityPolicy, "", "Missing Content-Security-Policy");
assert.equal(Buffer.byteLength(noJavaScriptStyle, "utf8"), 265);
assert.equal(sha256Source(noJavaScriptStyle), noJavaScriptStyleHash);
assert.ok(!vercelConfigurationSource.includes(previousNoJavaScriptStyleHash));

const routeDocuments = [];
const routeDocumentHashes = [];
const liveInlineScriptHashes = new Set();
const noJavaScriptDocuments = [];
let prerenderedNoJavaScriptMarkerTotal = 0;
for (const route of expectedRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  routeDocuments.push(html);
  noJavaScriptDocuments.push(html);
  routeDocumentHashes.push(
    createHash("sha256").update(html).digest("hex"),
  );

  assert.match(html, new RegExp(`<html lang="${route.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${route.title}</title>`));
  assert.ok(
    html.includes(
      `name="description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: description`,
  );
  assert.ok(html.includes(`rel="canonical" href="${canonical(route.pathname)}"`));
  assert.ok(html.includes('name="description" content="'));
  assert.ok(html.includes('name="robots" content="index, follow"'));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(
    html.includes(`property="og:title" content="${route.title}"`),
    `${route.pathname}: og:title`,
  );
  assert.ok(
    html.includes(
      `property="og:description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: og:description`,
  );
  assert.ok(html.includes(`property="og:url" content="${canonical(route.pathname)}"`));
  assert.ok(html.includes('property="og:image"'));
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="630"'));
  assert.ok(html.includes('property="og:image:alt"'));
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes('name="twitter:title"'));
  assert.ok(
    html.includes(`name="twitter:title" content="${route.title}"`),
    `${route.pathname}: twitter:title`,
  );
  assert.ok(
    html.includes(
      `name="twitter:description" content="${escapeHtmlAttribute(route.description)}"`,
    ),
    `${route.pathname}: twitter:description`,
  );
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
  assert.ok(!html.includes("data:image/gif"), `${route.pathname}: data GIF`);
  assert.equal(
    count(html, noJavaScriptBlock),
    1,
    `${route.pathname}: exact no-JavaScript block`,
  );
  assert.equal(
    count(html, 'data-nojs-visible="true"'),
    route.noJavaScriptMarkers,
    `${route.pathname}: no-JavaScript markers`,
  );
  assert.match(
    html,
    /<footer[^>]*data-nojs-visible="true"[^>]*>/,
    `${route.pathname}: marked Footer`,
  );
  assertNoJavaScriptNavigation(html, {
    englishPath,
    lang: route.lang,
    spanishPath,
  });
  prerenderedNoJavaScriptMarkerTotal += route.noJavaScriptMarkers;
  for (const fallback of suspenseFallbacks) {
    assert.ok(!html.includes(fallback), `${route.pathname}: ${fallback}`);
  }

  const scripts = inlineScripts(html);
  const expectedGraph = expectedStructuredData.get(route.pathname);
  const expectedJsonLdCount = expectedGraph === undefined ? 0 : 1;
  assert.equal(scripts.length, expectedJsonLdCount, route.pathname);
  for (const [, jsonLd] of scripts) {
    const parsed = JSON.parse(jsonLd);
    assert.equal(parsed["@context"], "https://schema.org", route.pathname);
    assert.deepEqual(
      parsed["@graph"].map((node) => node["@type"]),
      expectedGraph.types,
      `${route.pathname}: graph types`,
    );
    assert.deepEqual(
      parsed["@graph"].map((node) => node["@id"]),
      expectedGraph.ids,
      `${route.pathname}: graph IDs`,
    );
    const hash = sha256Source(jsonLd);
    liveInlineScriptHashes.add(hash);
    assert.ok(
      contentSecurityPolicy.includes(hash),
      `${route.pathname}: JSON-LD CSP hash`,
    );
    for (const forbidden of [
      "Meta React",
      "https://www.ibm.com/skills-network",
      '"issuer"',
      '"issuedBy"',
      '"dateIssued"',
      '"offers"',
      '"price"',
      '"rating"',
      '"review"',
      '"operatingSystem"',
      "SoftwareApplication",
    ]) {
      assert.ok(!jsonLd.includes(forbidden), `${route.pathname}: ${forbidden}`);
    }
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

const expectedNotFoundArtifacts = [
  {
    file: "404.html",
    lang: "es",
    title: "Página no encontrada | devrodri",
    description: "La página solicitada no está disponible.",
    heading: "Página no encontrada",
    body: "La página que buscás no está disponible.",
    cta: "Volver al inicio",
    ctaPath: "/",
    noJavaScriptMarkers: 1,
  },
  {
    file: "en/404.html",
    lang: "en",
    title: "Page not found | devrodri",
    description: "The requested page isn't available.",
    heading: "Page not found",
    body: "The page you're looking for isn't available.",
    cta: "Back to home",
    ctaPath: "/en",
    noJavaScriptMarkers: 1,
  },
];
const notFoundDocuments = [];
for (const artifact of expectedNotFoundArtifacts) {
  const html = await readFile(path.join(distDirectory, artifact.file), "utf8");
  notFoundDocuments.push(html);
  noJavaScriptDocuments.push(html);

  assert.match(html, new RegExp(`<html lang="${artifact.lang}"`));
  assert.ok(html.includes(`<title data-rh="true">${artifact.title}</title>`));
  assert.ok(
    html.includes(
      `name="description" content="${escapeHtmlAttribute(artifact.description)}"`,
    ),
    artifact.file,
  );
  assert.ok(html.includes(artifact.heading), artifact.file);
  assert.ok(
    html.includes(artifact.body.replaceAll("'", "&#x27;")),
    artifact.file,
  );
  assert.ok(html.includes(`href="${artifact.ctaPath}"`), artifact.file);
  assert.ok(html.includes(artifact.cta), artifact.file);
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
  assert.equal(count(html, "<title"), 1);
  assert.equal(count(html, 'name="description"'), 1);
  assert.equal(count(html, 'name="robots"'), 1);
  assert.equal(count(html, 'rel="canonical"'), 0);
  assert.equal(count(html, 'rel="alternate"'), 0);
  assert.equal(count(html, 'property="og:'), 0);
  assert.equal(count(html, 'name="twitter:'), 0);
  assert.equal(inlineScripts(html).length, 0);
  assert.equal(count(html, "<main"), 1);
  assert.equal(count(html, "<h1"), 1);
  assert.ok(!html.includes("Sitios web que comunican y convierten."));
  assert.ok(!html.includes("Websites built to communicate and convert."));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("data:image/gif"), `${artifact.file}: data GIF`);
  assert.equal(
    count(html, noJavaScriptBlock),
    1,
    `${artifact.file}: exact no-JavaScript block`,
  );
  assert.equal(
    count(html, 'data-nojs-visible="true"'),
    artifact.noJavaScriptMarkers,
    `${artifact.file}: no-JavaScript markers`,
  );
  assert.match(
    html,
    /<footer[^>]*data-nojs-visible="true"[^>]*>/,
    `${artifact.file}: marked Footer`,
  );
  assertNoJavaScriptNavigation(html, {
    englishPath: "/en",
    lang: artifact.lang,
    spanishPath: "/",
  });
  prerenderedNoJavaScriptMarkerTotal += artifact.noJavaScriptMarkers;
}
assert.equal(new Set(notFoundDocuments).size, expectedNotFoundArtifacts.length);
assert.equal(noJavaScriptDocuments.length, 8);
assert.equal(prerenderedNoJavaScriptMarkerTotal, 56);

const styleSourceDirective = contentSecurityPolicy
  .split(";")
  .map((directive) => directive.trim().split(/\s+/))
  .find(([name]) => name === "style-src");
assert.deepEqual(styleSourceDirective, [
  "style-src",
  "'self'",
  noJavaScriptStyleHash,
]);
assert.equal(count(contentSecurityPolicy, noJavaScriptStyleHash), 1);

const scriptSourceDirective = contentSecurityPolicy
  .split(";")
  .map((directive) => directive.trim().split(/\s+/))
  .find(([name]) => name === "script-src");
assert.ok(scriptSourceDirective, "Missing script-src directive");
const configuredInlineHashes = scriptSourceDirective
  .slice(1)
  .filter((source) => source.startsWith("'sha256-"));
assert.deepEqual(
  configuredInlineHashes.toSorted(),
  [...liveInlineScriptHashes].toSorted(),
  "script-src must contain every live inline hash and no obsolete inline hash",
);
assert.ok(!scriptSourceDirective.includes("'unsafe-inline'"));

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
const localizedNotFoundRouteSource =
  "/en/(?!portfolio(?:/lem-box)?/?$).+$";
assert.deepEqual(vercelConfiguration.routes, [
  {
    src: localizedNotFoundRouteSource,
    caseSensitive: true,
    status: 404,
    dest: "/en/404.html",
    headers: canonicalSecurityHeaders,
  },
]);
assert.ok(!JSON.stringify(vercelConfiguration.routes).includes('"handle"'));
assert.equal(
  vercelConfigurationSource.match(/"Content-Security-Policy"\s*:/g)?.length ?? 0,
  1,
);

const [localizedNotFoundTerminalRoute] = vercelConfiguration.routes;
assert.equal(localizedNotFoundTerminalRoute.dest, "/en/404.html");
assert.equal(localizedNotFoundTerminalRoute.status, 404);
assert.ok(!("continue" in localizedNotFoundTerminalRoute));
assert.deepEqual(
  localizedNotFoundTerminalRoute.headers,
  canonicalSecurityHeaders,
);
assert.equal(
  Object.keys(localizedNotFoundTerminalRoute.headers).filter(
    (key) => key.toLowerCase() === "content-security-policy",
  ).length,
  1,
);

const localizedNotFoundRoute = new RegExp(localizedNotFoundRouteSource);
for (const publicEnglishPath of [
  "/en",
  "/en/",
  "/en/portfolio",
  "/en/portfolio/",
  "/en/portfolio/lem-box",
  "/en/portfolio/lem-box/",
]) {
  assert.equal(localizedNotFoundRoute.test(publicEnglishPath), false);
}
for (const invalidEnglishPath of [
  "/en/no-existe",
  "/en/portfolio/no-existe",
]) {
  assert.equal(localizedNotFoundRoute.test(invalidEnglishPath), true);
}

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
for (const assetFile of assetFiles.filter((file) =>
  /\.(?:css|js)$/.test(file)
)) {
  const source = await readFile(
    path.join(distDirectory, "assets", assetFile),
    "utf8",
  );
  assert.ok(!source.includes("data:image/gif"), `${assetFile}: data GIF`);
}
for (const serverFile of serverFiles.filter((file) => /\.mjs$/.test(file))) {
  const source = await readFile(
    path.join(serverDirectory, serverFile),
    "utf8",
  );
  assert.ok(!source.includes("data:image/gif"), `${serverFile}: data GIF`);
}
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
