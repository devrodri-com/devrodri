import { describe, expect, it, vi } from "vitest";

interface DirectoryEntry {
  isDirectory(): boolean;
  isFile(): boolean;
  name: string;
}

interface FileSystemApi {
  readFileSync(path: string, encoding: "utf8"): string;
  readdirSync(
    path: string,
    options: { withFileTypes: true },
  ): DirectoryEntry[];
}

interface HashApi {
  digest(encoding: "hex"): string;
  update(value: string): HashApi;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

interface PathApi {
  dirname(path: string): string;
  join(...paths: string[]): string;
  relative(from: string, to: string): string;
  sep: string;
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
const sourceRoot = path.join(projectRoot, "src");
const marker = "data-nojs-visible";

const approvedFiles = {
  "src/Components/CTASection.tsx": {
    baselineHash:
      "25a483d33b5077d3e2117d22b0e3e58d2f76a7097a8eea4fa61839fdb5117705",
    markers: 1,
  },
  "src/Components/ContactSection.tsx": {
    baselineHash:
      "bd68aeae219de6f6e90a496f597021ade2a411545beef8046c3dd293a57a74b3",
    markers: 1,
  },
  "src/Components/Footer.tsx": {
    baselineHash:
      "1479eba8c76e36da4fdcbaff04cfccc6a998af144f28c7dfc647eb89c30926aa",
    markers: 1,
  },
  "src/Components/HeroSlider.tsx": {
    baselineHash:
      "884719867960021cb39d358e7fbd61357209093378dd64e07ae0f34745a293b9",
    markers: 1,
  },
  "src/Components/PortfolioSection.tsx": {
    baselineHash:
      "89839bc9444158bb1e1a70a093876d1ca60ba583e388f63f8f578f6503c2101b",
    markers: 4,
  },
  "src/Components/SobreMiSection.tsx": {
    baselineHash:
      "408358b4273826ad7f07bc14bbd015719e17fc960705a3b4295763ec66fdd488",
    markers: 2,
  },
  "src/Components/TransitionServicesIntro.tsx": {
    baselineHash:
      "0a6d4548fb6761c693133f709eda744f7ea4c9c42e230107f22d03d7925b5b2c",
    markers: 2,
  },
  "src/Components/portfolio/PortfolioCard.tsx": {
    baselineHash:
      "c74bed74086dabd4988f143a677732349715168e106af4f6bcddc9d3bf615369",
    markers: 1,
  },
} as const;

function listProductionTsxFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return ["test", "__tests__"].includes(entry.name)
          ? []
          : listProductionTsxFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith(".tsx") ? [entryPath] : [];
    });
}

function relativePath(filePath: string) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function source(file: keyof typeof approvedFiles) {
  return fs.readFileSync(path.join(projectRoot, file), "utf8");
}

function occurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

describe("targeted no-JavaScript visibility contract", () => {
  it("keeps exactly 13 bare markers in the eight approved component files", () => {
    const markedFiles = Object.fromEntries(
      listProductionTsxFiles(sourceRoot)
        .map((filePath) => {
          const fileSource = fs.readFileSync(filePath, "utf8");
          return [relativePath(filePath), occurrences(fileSource, marker)] as const;
        })
        .filter(([, count]) => count > 0)
        .sort(([left], [right]) => left.localeCompare(right)),
    );
    const expectedMarkerCounts = Object.fromEntries(
      Object.entries(approvedFiles).map(([file, contract]) => [
        file,
        contract.markers,
      ]),
    );

    expect(markedFiles).toEqual(expectedMarkerCounts);
    expect(Object.values(markedFiles).reduce((sum, count) => sum + count, 0)).toBe(
      13,
    );

    for (const file of Object.keys(approvedFiles) as Array<
      keyof typeof approvedFiles
    >) {
      const fileSource = source(file);
      expect(fileSource.match(/^[ \t]*data-nojs-visible[ \t]*$/gm) ?? []).toHaveLength(
        approvedFiles[file].markers,
      );
      expect(fileSource).not.toContain("data-nojs-visible=");
    }
  });

  it("leaves every approved component byte-equivalent after removing marker lines", () => {
    for (const file of Object.keys(approvedFiles) as Array<
      keyof typeof approvedFiles
    >) {
      const withoutMarkers = source(file).replace(
        /^[ \t]*data-nojs-visible[ \t]*\r?\n/gm,
        "",
      );
      expect(sha256(withoutMarkers), file).toBe(
        approvedFiles[file].baselineHash,
      );
    }
  });

  it("marks only the approved active content carriers", () => {
    expect(source("src/Components/HeroSlider.tsx")).toContain(
      "key={currentSlide.id}\n          data-nojs-visible\n          className=\"absolute inset-0\"",
    );
    expect(source("src/Components/SobreMiSection.tsx")).toContain(
      "id=\"sobremi\"\n      data-nojs-visible",
    );
    expect(source("src/Components/TransitionServicesIntro.tsx")).toContain(
      "<motion.section\n      data-nojs-visible",
    );
    expect(source("src/Components/PortfolioSection.tsx")).toContain(
      "<motion.div\n                data-nojs-visible\n                className=\"group h-full",
    );
    expect(source("src/Components/portfolio/PortfolioCard.tsx")).toContain(
      "return (\n    <motion.div\n      data-nojs-visible",
    );
    expect(source("src/Components/ContactSection.tsx")).toContain(
      "<motion.div\n        data-nojs-visible\n        className=\"relative z-30",
    );
    expect(source("src/Components/CTASection.tsx")).toContain(
      "id=\"cta\"\n      data-nojs-visible",
    );
    expect(source("src/Components/Footer.tsx")).toContain(
      "<motion.footer\n      data-nojs-visible",
    );
  });

  it("preserves intentional hiding, the flicker fix, and CTA focus semantics", () => {
    const contact = source("src/Components/ContactSection.tsx");
    const portfolio = source("src/Components/PortfolioSection.tsx");
    const cta = source("src/Components/CTASection.tsx");

    expect(contact).toContain(
      '<input type="text" name="_honey" className="hidden" style={{ display: "none" }} />',
    );
    expect(contact).not.toMatch(/<input[^>]*data-nojs-visible[^>]*>/);
    expect(portfolio).toContain(
      'return (\n    <section\n      id="portfolio"',
    );
    expect(portfolio).not.toContain("<motion.section");
    expect(portfolio).toContain("motion-reduce:transition-none");
    expect(cta).toContain("initial: false as const");
    expect(cta).not.toContain("tabIndex");

    const allApprovedSource = Object.keys(approvedFiles)
      .map((file) => source(file as keyof typeof approvedFiles))
      .join("\n");
    expect(allApprovedSource).not.toContain("initial={false}");
    expect(allApprovedSource).not.toContain("AnimatePresence initial={false}");
    expect(allApprovedSource).not.toMatch(
      /<[^>]*data-nojs-visible[^>]*aria-hidden[^>]*>/,
    );
  });
});
