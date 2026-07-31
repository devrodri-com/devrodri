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
  },
  {
    pathname: "/portfolio",
    file: "portfolio/index.html",
    lang: "es",
    title: "Portfolio: sitios, sistemas y productos | Rodrigo Opalo",
    description:
      "Explorá proyectos de sistemas, sitios web, e-commerce y estrategia de marca, con detalles de alcance, rol y tecnología.",
    content: "Algunos trabajos",
  },
  {
    pathname: "/portfolio/lem-box",
    file: "portfolio/lem-box/index.html",
    lang: "es",
    title: "LEM-BOX: plataforma logística y producto propio | Rodrigo Opalo",
    description:
      "Caso de producto propio: un ecosistema digital conectado con la operación logística de LEM-BOX en Estados Unidos, Uruguay y Argentina.",
    content: "Un producto conectado a una operación real",
  },
  {
    pathname: "/en",
    file: "en/index.html",
    lang: "en",
    title: "Rodrigo Opalo | Websites, systems and automation",
    description:
      "I build custom websites, applications, and systems, plus automations and integrations aligned with real business goals.",
    content: "Websites built to communicate and convert.",
  },
  {
    pathname: "/en/portfolio",
    file: "en/portfolio/index.html",
    lang: "en",
    title: "Portfolio: websites, systems and products | Rodrigo Opalo",
    description:
      "Explore systems, websites, e-commerce, and brand strategy projects with details on scope, role, and technology.",
    content: "Some Work",
  },
  {
    pathname: "/en/portfolio/lem-box",
    file: "en/portfolio/lem-box/index.html",
    lang: "en",
    title: "LEM-BOX: logistics platform and own product | Rodrigo Opalo",
    description:
      "Own-product case study: a digital ecosystem connected to LEM-BOX's logistics operation across the United States, Uruguay, and Argentina.",
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
const liveInlineScriptHashes = new Set();
for (const route of expectedRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  routeDocuments.push(html);
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
