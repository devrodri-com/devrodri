import { describe, expect, it, vi } from "vitest";

interface FileSystemApi {
  existsSync(path: string): boolean;
  readFileSync(path: string): Uint8Array;
  readFileSync(path: string, encoding: "utf8"): string;
  readdirSync(path: string): string[];
  statSync(path: string): { size: number };
}

interface HashApi {
  update(data: Uint8Array): HashApi;
  digest(encoding: "hex"): string;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
}

interface UrlApi {
  fileURLToPath(url: string): string;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const crypto = await vi.importActual<CryptoApi>("node:crypto");
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

  it("self-hosts one Inter file through five discrete weight faces", () => {
    const indexHtml = fs.readFileSync(repositoryPath("index.html"), "utf8");
    const indexCss = fs.readFileSync(
      repositoryPath("src/index.css"),
      "utf8",
    );
    const interFaces = indexCss.match(/@font-face\s*\{[^}]+\}/g) ?? [];
    const localFontReferences =
      indexCss.match(/url\("\.\/assets\/fonts\/Inter-latin\.woff2"\)/g) ?? [];
    const localWoff2Files = fs
      .readdirSync(repositoryPath("src/assets/fonts"))
      .filter((fileName) => fileName.endsWith(".woff2"));
    const localFontPath = repositoryPath(
      "src/assets/fonts/Inter-latin.woff2",
    );
    const localFont = fs.readFileSync(localFontPath);
    const latinUnicodeRange = [
      "U+0000-00FF",
      "U+0131",
      "U+0152-0153",
      "U+02BB-02BC",
      "U+02C6",
      "U+02DA",
      "U+02DC",
      "U+0304",
      "U+0308",
      "U+0329",
      "U+2000-206F",
      "U+20AC",
      "U+2122",
      "U+2191",
      "U+2193",
      "U+2212",
      "U+2215",
      "U+FEFF",
      "U+FFFD",
    ].join(", ");

    expect(indexHtml).not.toContain("fonts.googleapis.com");
    expect(indexHtml).not.toContain("fonts.gstatic.com");
    expect(indexCss).not.toContain("@import");
    expect(indexCss).not.toContain("fonts.googleapis.com");
    expect(indexCss).not.toContain("font-weight: 300 700");
    expect(indexCss).not.toContain("font-variation-settings");
    expect(interFaces).toHaveLength(5);
    expect(
      interFaces.map(
        (face) => face.match(/font-weight:\s*(\d+);/)?.[1],
      ),
    ).toEqual(["300", "400", "500", "600", "700"]);

    for (const face of interFaces) {
      expect(face).toContain('font-family: "Inter"');
      expect(face).toContain("font-style: normal");
      expect(face).toContain("font-display: swap");
      expect(face).toContain('format("woff2")');
      expect(face.replace(/\s+/g, " ")).toContain(
        `unicode-range: ${latinUnicodeRange}`,
      );
    }

    expect(localFontReferences).toHaveLength(5);
    expect(localWoff2Files).toEqual(["Inter-latin.woff2"]);
    expect(fs.statSync(localFontPath).size).toBe(48_432);
    expect(crypto.createHash("sha256").update(localFont).digest("hex")).toBe(
      "c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4",
    );

    const license = fs.readFileSync(
      repositoryPath("src/assets/fonts/OFL.txt"),
      "utf8",
    );
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
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
