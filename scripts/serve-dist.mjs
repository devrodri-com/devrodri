import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const port = Number.parseInt(process.env.PORT ?? "4173", 10);
const vercelConfiguration = JSON.parse(
  await readFile(path.join(projectRoot, "vercel.json"), "utf8"),
);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
]);

function applyConfiguredHeaders(response, pathname) {
  for (const rule of vercelConfiguration.headers ?? []) {
    const matches =
      rule.source === "/(.*)" ||
      (rule.source === "/assets/(.*)" && pathname.startsWith("/assets/")) ||
      rule.source === pathname;
    if (!matches) continue;
    for (const header of rule.headers) {
      response.setHeader(header.key, header.value);
    }
  }
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveFile(pathname) {
  if (pathname === "/") {
    return { filePath: path.join(distDirectory, "index.html"), status: 200 };
  }

  const relativePath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const directPath = path.resolve(distDirectory, relativePath);
  if (
    directPath.startsWith(`${distDirectory}${path.sep}`) &&
    await isFile(directPath)
  ) {
    return { filePath: directPath, status: 200 };
  }

  const indexPath = path.resolve(distDirectory, relativePath, "index.html");
  if (
    indexPath.startsWith(`${distDirectory}${path.sep}`) &&
    await isFile(indexPath)
  ) {
    return { filePath: indexPath, status: 200 };
  }

  const notFoundFile = pathname === "/en" || pathname.startsWith("/en/")
    ? path.join(distDirectory, "en", "404.html")
    : path.join(distDirectory, "404.html");
  return { filePath: notFoundFile, status: 404 };
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      response.statusCode = 308;
      response.setHeader(
        "Location",
        `${url.pathname.slice(0, -1)}${url.search}`,
      );
      response.end();
      return;
    }

    const { filePath, status } = await resolveFile(url.pathname);
    response.statusCode = status;
    response.setHeader(
      "Content-Type",
      mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream",
    );
    applyConfiguredHeaders(response, url.pathname);

    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.statusCode = 500;
    response.end("Internal Server Error");
    console.error(error);
  }
});

server.listen(port, "127.0.0.1", () => {
  const address = server.address();
  const listeningPort =
    typeof address === "object" && address !== null ? address.port : port;
  console.log(
    `Static verification server listening on http://127.0.0.1:${listeningPort}`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
