import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ExperienceSection from "../Components/ExperienceSection";
import ImpactSection from "../Components/ImpactSection";
import SobreMiSection from "../Components/SobreMiSection";
import TransitionServicesIntro from "../Components/TransitionServicesIntro";
import { LanguageProvider } from "../i18n/LanguageProvider";

interface DirectoryEntry {
  name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

interface FileSystemApi {
  existsSync(path: string): boolean;
  readFileSync(path: string): Uint8Array;
  readdirSync(
    path: string,
    options: { withFileTypes: true },
  ): DirectoryEntry[];
}

interface HashApi {
  update(value: Uint8Array): HashApi;
  digest(encoding: "hex"): string;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

interface PathApi {
  dirname(path: string): string;
  extname(path: string): string;
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

const originalHashes = {
  "public/img/certs/ibm-fullstack.png":
    "6ee555a121073ac6805ae25fc136a56c31d85724c909bd4a03b8c32db808611e",
  "public/img/servicios.jpg":
    "69e1bee08d1e8fff1ea76bd41c1660c27cb91bcfaa8f325f1863d66cb59afc4f",
  "public/img/experience.jpg":
    "63250b7345b73f4839bd57c885560638a52a578cc86d412b746ea8213f01fe6c",
  "public/img/impact.jpg":
    "266a758a33f200742b72a3aed19da6c9ff729f333d93234ed80a783368838827",
  "public/img/sobremi.jpg":
    "f6fc91bd9cf3901ef5f48301d97971cbb0f1fecdfd7f1afd3eb9a38a2de49eba",
} as const;

const originalRuntimePaths = [
  "/img/certs/ibm-fullstack.png",
  "/img/servicios.jpg",
  "/img/experience.jpg",
  "/img/impact.jpg",
  "/img/sobremi.jpg",
] as const;

function listFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath);
    return entry.isFile() ? [entryPath] : [];
  });
}

function renderAffectedHomeSections() {
  localStorage.setItem("language", "es");
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <SobreMiSection />
        <TransitionServicesIntro />
        <ExperienceSection />
        <ImpactSection />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

function getPicture(container: HTMLElement, imageId: string) {
  const image = container.querySelector<HTMLImageElement>(
    `img[data-home-image="${imageId}"]`,
  );
  const picture = image?.closest("picture");
  if (!(image instanceof HTMLImageElement) || !(picture instanceof HTMLPictureElement)) {
    throw new Error(`Missing responsive picture: ${imageId}`);
  }
  return { image, picture };
}

function widths(element: Element, attribute = "srcset") {
  const value = element.getAttribute(attribute);
  if (value === null) throw new Error(`Missing ${attribute}`);
  return Array.from(value.matchAll(/\s(\d+)w(?:,|$)/g), (match) =>
    Number(match[1]),
  );
}

describe("Home responsive image contracts", () => {
  it("preserves every locked original byte-for-byte", () => {
    for (const [relativePath, expectedHash] of Object.entries(originalHashes)) {
      const absolutePath = path.join(projectRoot, relativePath);
      expect(fs.existsSync(absolutePath)).toBe(true);
      const actualHash = crypto
        .createHash("sha256")
        .update(fs.readFileSync(absolutePath))
        .digest("hex");
      expect(actualHash).toBe(expectedHash);
    }
  });

  it("keeps the exact reviewed variant inventory", () => {
    const assetsRoot = path.join(projectRoot, "src/assets/home");
    const files = listFiles(assetsRoot);
    const extensionCounts = files.reduce<Record<string, number>>(
      (counts, file) => {
        const extension = path.extname(file).slice(1);
        counts[extension] = (counts[extension] ?? 0) + 1;
        return counts;
      },
      {},
    );
    const directoryCounts = Object.fromEntries(
      ["experience", "impact", "servicios", "sobremi", "ibm"].map(
        (directory) => [
          directory,
          listFiles(path.join(assetsRoot, directory)).length,
        ],
      ),
    );

    expect(files).toHaveLength(63);
    expect(extensionCounts).toEqual({ avif: 19, jpg: 19, png: 3, webp: 22 });
    expect(directoryCounts).toEqual({
      experience: 12,
      impact: 12,
      servicios: 24,
      sobremi: 9,
      ibm: 6,
    });
  });

  it("renders one lazy image per picture and never uses an original as runtime fallback", () => {
    const { container } = renderAffectedHomeSections();
    const pictures = Array.from(container.querySelectorAll("picture"));
    const images = Array.from(
      container.querySelectorAll<HTMLImageElement>("img[data-home-image]"),
    );

    expect(pictures).toHaveLength(5);
    expect(images).toHaveLength(5);
    for (const picture of pictures) {
      expect(picture.querySelectorAll("img")).toHaveLength(1);
    }
    for (const image of images) {
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("decoding", "async");
    }

    const runtimeDescriptors = [
      ...images.flatMap((image) => [image.src, image.srcset]),
      ...Array.from(container.querySelectorAll("source"), (source) =>
        source.getAttribute("srcset") ?? "",
      ),
    ].join("\n");
    for (const originalPath of originalRuntimePaths) {
      expect(runtimeDescriptors).not.toContain(originalPath);
    }
    expect(runtimeDescriptors).not.toContain("data:image");
    expect(
      container.querySelector('a[href="/img/certs/ibm-fullstack.png"]'),
    ).toBeInTheDocument();
  });

  it("uses the approved formats, widths, dimensions and semantics", () => {
    const { container } = renderAffectedHomeSections();
    const contracts = [
      {
        id: "sobremi",
        types: ["image/avif", "image/webp"],
        widths: [160, 240, 320],
        fallbackWidths: [160, 240, 320],
        dimensions: [320, 320],
        alt: "Rodrigo Opalo",
      },
      {
        id: "ibm-certificate",
        types: ["image/webp"],
        widths: [88, 176, 264],
        fallbackWidths: [88, 176, 264],
        dimensions: [88, 68],
        alt: "",
      },
      {
        id: "experience",
        types: ["image/avif", "image/webp"],
        widths: [480, 768, 1200, 1536],
        fallbackWidths: [480, 768, 1200, 1536],
        dimensions: [1536, 1024],
        alt: "",
      },
      {
        id: "impact",
        types: ["image/avif", "image/webp"],
        widths: [480, 768, 1200, 1536],
        fallbackWidths: [480, 768, 1200, 1536],
        dimensions: [1536, 1024],
        alt: "",
      },
    ] as const;

    for (const contract of contracts) {
      const { image, picture } = getPicture(container, contract.id);
      const sources = Array.from(picture.querySelectorAll("source"));
      expect(sources.map((source) => source.type)).toEqual(contract.types);
      for (const source of sources) expect(widths(source)).toEqual(contract.widths);
      expect(widths(image)).toEqual(contract.fallbackWidths);
      expect(image).toHaveAttribute("width", String(contract.dimensions[0]));
      expect(image).toHaveAttribute("height", String(contract.dimensions[1]));
      expect(image).toHaveAttribute("alt", contract.alt);
    }
  });

  it("art-directs the services crop at the measured breakpoints", () => {
    const { container } = renderAffectedHomeSections();
    const { image, picture } = getPicture(container, "servicios");
    const sources = Array.from(picture.querySelectorAll("source"));
    const expectedWidths = [
      [1200, 1920],
      [768, 1440, 1920],
      [480, 960, 1440],
      [1200, 1920],
      [768, 1440, 1920],
      [480, 960, 1440],
      [1200, 1920],
      [768, 1440, 1920],
      [480, 960, 1440],
    ];
    const expectedMedia = [
      "(min-width: 1200px)",
      "(min-width: 640px)",
      null,
      "(min-width: 1200px)",
      "(min-width: 640px)",
      null,
      "(min-width: 1200px)",
      "(min-width: 640px)",
      null,
    ];

    expect(sources.map((source) => source.type)).toEqual([
      "image/avif",
      "image/avif",
      "image/avif",
      "image/webp",
      "image/webp",
      "image/webp",
      "image/jpeg",
      "image/jpeg",
      "image/jpeg",
    ]);
    expect(sources.map((source) => source.getAttribute("media"))).toEqual(
      expectedMedia,
    );
    sources.forEach((source, index) => {
      expect(widths(source)).toEqual(expectedWidths[index]);
    });
    expect(widths(image)).toEqual([480, 960, 1440]);
    expect(image).toHaveAttribute("width", "480");
    expect(image).toHaveAttribute("height", "160");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveClass("object-cover", "object-center");
  });
});
