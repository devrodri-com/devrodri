import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const distDirectory = path.join(process.cwd(), "dist");
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

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function canonical(pathname) {
  return `https://www.devrodri.com${pathname}`;
}

const routeDocuments = [];
for (const route of expectedRoutes) {
  const html = await readFile(path.join(distDirectory, route.file), "utf8");
  routeDocuments.push(html);

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
  assert.equal(count(html, 'rel="canonical"'), 1);
  assert.equal(count(html, 'rel="alternate"'), 3);
  assert.ok(html.includes('hrefLang="es"'));
  assert.ok(html.includes('hrefLang="en"'));
  assert.ok(html.includes('hrefLang="x-default"'));
  assert.ok(html.includes(route.content));
  assert.ok(html.includes('<div id="root"><div'));
  assert.ok(!html.includes("<!--app-head-->"));
  assert.ok(!html.includes("<!--app-html-->"));
  assert.ok(!html.includes("/unknown"));

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

const notFoundHtml = await readFile(
  path.join(distDirectory, "404.html"),
  "utf8",
);
assert.ok(notFoundHtml.includes("Página no encontrada"));
assert.ok(notFoundHtml.includes('name="robots" content="noindex, nofollow"'));
assert.equal(count(notFoundHtml, 'rel="canonical"'), 0);
assert.equal(count(notFoundHtml, 'rel="alternate"'), 0);
assert.equal(count(notFoundHtml, 'property="og:url"'), 0);
assert.ok(notFoundHtml.includes("<main"));

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
for (const forbidden of ["<lastmod>", "/404", "vercel.app"]) {
  assert.ok(!sitemap.includes(forbidden));
}
assert.ok(sitemapLocations.every((location) => !/[?#]/.test(location)));

console.log(
  `Verified ${expectedRoutes.length} route documents, 404, robots and sitemap`,
);
