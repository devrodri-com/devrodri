import { describe, expect, it, vi } from "vitest";

interface FileSystemApi {
  existsSync(path: string): boolean;
  readFileSync(path: string, encoding: "utf8"): string;
  readdirSync(path: string): string[];
}

interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
}

interface UrlApi {
  fileURLToPath(url: string): string;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const path = await vi.importActual<PathApi>("node:path");
const url = await vi.importActual<UrlApi>("node:url");
const projectRoot = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../..",
);

const repositoryPath = (...segments: string[]) =>
  path.join(projectRoot, ...segments);

describe("repository hygiene", () => {
  it("keeps one valid PostCSS configuration", () => {
    const postcssConfigurations = fs
      .readdirSync(projectRoot)
      .filter((fileName) => fileName.startsWith("postcss.config."));

    expect(postcssConfigurations).toEqual(["postcss.config.js"]);
    expect(
      fs.readFileSync(repositoryPath("postcss.config.js"), "utf8"),
    ).toContain("tailwindcss");
    expect(
      fs.readFileSync(repositoryPath("postcss.config.js"), "utf8"),
    ).toContain("autoprefixer");
  });

  it("loads global CSS once from the application entrypoint", () => {
    const mainSource = fs.readFileSync(
      repositoryPath("src/main.tsx"),
      "utf8",
    );
    const appSource = fs.readFileSync(repositoryPath("src/App.tsx"), "utf8");
    const indexHtml = fs.readFileSync(repositoryPath("index.html"), "utf8");

    expect(mainSource.match(/index\.css/g)).toHaveLength(1);
    expect(appSource).not.toContain("index.css");
    expect(indexHtml).not.toContain("/src/index.css");
  });

  it("self-hosts one Inter file with every used weight", () => {
    const indexHtml = fs.readFileSync(repositoryPath("index.html"), "utf8");
    const indexCss = fs.readFileSync(
      repositoryPath("src/index.css"),
      "utf8",
    );

    expect(indexHtml).not.toContain("fonts.googleapis.com");
    expect(indexHtml).not.toContain("fonts.gstatic.com");
    expect(indexCss).not.toContain("@import");
    expect(indexCss).not.toContain("fonts.googleapis.com");
    expect(indexCss).toContain('font-family: "Inter"');
    expect(indexCss).toContain("font-weight: 300 700");
    expect(indexCss).toContain("font-display: swap");
    expect(indexCss).toContain(
      'url("./assets/fonts/Inter-latin.woff2") format("woff2")',
    );
    expect(
      fs.existsSync(repositoryPath("src/assets/fonts/Inter-latin.woff2")),
    ).toBe(true);
    expect(fs.existsSync(repositoryPath("src/assets/fonts/OFL.txt"))).toBe(
      true,
    );
  });

  it("removes only the confirmed dead modules and starter asset", () => {
    const removedPaths = [
      "src/Components/GallerySection.tsx",
      "src/Components/TestimonialsSection.tsx",
      "src/Components/TransitionIntro.tsx",
      "src/App.css",
      "src/assets/react.svg",
    ];

    for (const removedPath of removedPaths) {
      expect(fs.existsSync(repositoryPath(removedPath))).toBe(false);
    }
  });

  it("keeps current repository and security documentation", () => {
    for (const documentationPath of [
      "README.md",
      "README.es.md",
      "README.en.md",
      "SECURITY.md",
    ]) {
      expect(fs.existsSync(repositoryPath(documentationPath))).toBe(true);
    }

    expect(
      fs.readFileSync(repositoryPath("SECURITY.md"), "utf8"),
    ).toContain("Private Vulnerability Reporting");
  });
});
