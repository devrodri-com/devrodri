import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Writable } from "node:stream";
import { pathToFileURL } from "node:url";
import { renderToPipeableStream } from "react-dom/server";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const serverEntryUrl = pathToFileURL(
  path.join(projectRoot, "dist-ssr", "entry-server.mjs"),
).href;
const templatePath = path.join(distDirectory, "index.html");
const template = await readFile(templatePath, "utf8");
const { createServerApplication, PUBLIC_ROUTES } = await import(serverEntryUrl);

function render(url) {
  return new Promise((resolve, reject) => {
    const helmetContext = {};
    const chunks = [];
    const errors = [];
    let timeoutId;

    const output = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    output.on("finish", () => {
      clearTimeout(timeoutId);
      if (errors.length > 0) {
        reject(new AggregateError(errors, `Prerender failed for ${url}`));
        return;
      }
      resolve({
        appHtml: Buffer.concat(chunks).toString("utf8"),
        helmet: helmetContext.helmet,
      });
    });
    output.on("error", reject);

    const stream = renderToPipeableStream(
      createServerApplication(url, helmetContext),
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          errors.push(error);
        },
      },
    );

    timeoutId = setTimeout(() => {
      stream.abort();
      reject(new Error(`Prerender timed out for ${url}`));
    }, 15_000);
  });
}

function createDocument({ appHtml, helmet }) {
  if (helmet === undefined) {
    throw new Error("Helmet did not produce server metadata");
  }

  const htmlAttributes = helmet.htmlAttributes.toString();
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join("\n");

  return template
    .replace('<html lang="es">', `<html ${htmlAttributes}>`)
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", appHtml);
}

function outputPathFor(pathname) {
  if (pathname === "/") return path.join(distDirectory, "index.html");
  return path.join(
    distDirectory,
    pathname.slice(1),
    "index.html",
  );
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

for (const route of PUBLIC_ROUTES) {
  const result = await render(route.pathname);
  const outputPath = outputPathFor(route.pathname);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, createDocument(result));
}

const notFoundResult = await render("/__not-found__");
await writeFile(
  path.join(distDirectory, "404.html"),
  createDocument(notFoundResult),
);

await writeFile(
  path.join(distDirectory, "robots.txt"),
  [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://www.devrodri.com/sitemap.xml",
    "",
  ].join("\n"),
);

const sitemapLocations = PUBLIC_ROUTES
  .filter((route) => route.sitemap.include)
  .map((route) => `  <url><loc>${escapeXml(route.metadata.canonical)}</loc></url>`)
  .join("\n");
await writeFile(
  path.join(distDirectory, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapLocations,
    "</urlset>",
    "",
  ].join("\n"),
);

console.log(`Prerendered ${PUBLIC_ROUTES.length} public routes and 404.html`);
