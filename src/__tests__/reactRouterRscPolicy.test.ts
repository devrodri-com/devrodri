import { describe, expect, it, vi } from "vitest";

interface DirectoryEntry {
  name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

interface FileSystemApi {
  existsSync(path: string): boolean;
  mkdirSync(path: string, options: { recursive: true }): void;
  mkdtempSync(prefix: string): string;
  readFileSync(path: string, encoding: "utf8"): string;
  readdirSync(path: string, options: { withFileTypes: true }): DirectoryEntry[];
  rmSync(path: string, options: { force: true; recursive: true }): void;
  writeFileSync(path: string, content: string, encoding: "utf8"): void;
}

interface PathApi {
  basename(path: string): string;
  dirname(path: string): string;
  extname(path: string): string;
  join(...paths: string[]): string;
  relative(from: string, to: string): string;
}

interface OperatingSystemApi {
  tmpdir(): string;
}

interface UrlApi {
  fileURLToPath(url: string): string;
}

const fs = await vi.importActual<FileSystemApi>("node:fs");
const path = await vi.importActual<PathApi>("node:path");
const os = await vi.importActual<OperatingSystemApi>("node:os");
const url = await vi.importActual<UrlApi>("node:url");

const testDirectory = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.join(testDirectory, "../..");
const policyTestName = "reactRouterRscPolicy.test.ts";
const excludedDirectories = new Set([
  ".git",
  ".temp",
  ".tmp",
  ".vercel",
  "__tests__",
  "coverage",
  "dist",
  "docs",
  "documentation",
  "node_modules",
  "reports",
  "temp",
  "test",
  "tests",
  "tmp",
]);
const inspectedExtensions = new Set([
  ".cjs",
  ".cts",
  ".html",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".rsc",
  ".ts",
  ".tsx",
]);
const testFilePattern = /\.(?:spec|test)\.[^.]+$/;

const forbiddenSourceSignals = [
  "unstable_RSCHydratedRouter",
  "unstable_RSCStaticRouter",
  "unstable_routeRSCServerRequest",
  "unstable_matchRSCServerRequest",
  "unstable_getRSCStream",
  "unstable_RSCPayload",
  "@vitejs/plugin-rsc",
  "react-server-dom-",
  "entry.rsc",
];

const forbiddenDirectDependencies = [
  "@vitejs/plugin-rsc",
  "@react-router/dev",
  "@react-router/node",
  "react-server-dom-webpack",
  "react-server-dom-parcel",
  "react-server-dom-turbopack",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function shouldInspectFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  return (
    fileName !== policyTestName &&
    !testFilePattern.test(fileName) &&
    inspectedExtensions.has(path.extname(fileName))
  );
}

function authoredSourceFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return excludedDirectories.has(entry.name)
          ? []
          : authoredSourceFiles(filePath);
      }

      return entry.isFile() && shouldInspectFile(filePath) ? [filePath] : [];
    });
}

function sourceViolations(root: string): string[] {
  return authoredSourceFiles(root).flatMap((filePath) => {
    const relativePath = path.relative(root, filePath).split("\\").join("/");
    const content = fs.readFileSync(filePath, "utf8");
    const signalMatches = forbiddenSourceSignals
      .filter((signal) => relativePath.includes(signal) || content.includes(signal))
      .map((signal) => `${relativePath}: ${signal}`);
    const serverDirective = /["']use server["']/.test(content)
      ? [`${relativePath}: use server directive`]
      : [];

    return [...signalMatches, ...serverDirective];
  });
}

function dependencyViolations(root: string): string[] {
  const packagePath = path.join(root, "package.json");
  if (!fs.existsSync(packagePath)) return [];

  const packageJson: unknown = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const dependencyGroups = isRecord(packageJson)
    ? [packageJson.dependencies, packageJson.devDependencies]
    : [];
  const declaredDependencies = new Set(
    dependencyGroups
      .filter(isRecord)
      .flatMap((dependencies) => Object.keys(dependencies)),
  );

  return forbiddenDirectDependencies
    .filter((dependency) => declaredDependencies.has(dependency))
    .map((dependency) => `package.json: ${dependency}`);
}

function scanProject(root: string): string[] {
  return [...sourceViolations(root), ...dependencyViolations(root)];
}

function writeFixture(root: string, relativePath: string, content: string) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function withTempProject(assertions: (root: string) => void) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "devrodri-rsc-policy-"));
  try {
    assertions(root);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
}

describe("React Router RSC advisory policy", () => {
  it("rejects explicit RSC architecture signals in authored project files", () => {
    expect(scanProject(projectRoot)).toEqual([]);
  });

  it("detects a nested server directive in an .mts file", () => {
    withTempProject((root) => {
      writeFixture(root, "server/nested/entry.mts", '"use server";');

      expect(scanProject(root)).toContain(
        "server/nested/entry.mts: use server directive",
      );
    });
  });

  it("detects a nested RSC API in a .cts file", () => {
    withTempProject((root) => {
      writeFixture(
        root,
        "app/deep/entry.cts",
        "export const router = unstable_RSCStaticRouter;",
      );

      expect(scanProject(root)).toContain(
        "app/deep/entry.cts: unstable_RSCStaticRouter",
      );
    });
  });

  it("detects a forbidden direct dependency", () => {
    withTempProject((root) => {
      writeFixture(
        root,
        "package.json",
        JSON.stringify({ dependencies: { "@vitejs/plugin-rsc": "latest" } }),
      );

      expect(scanProject(root)).toContain("package.json: @vitejs/plugin-rsc");
    });
  });

  it("ignores documentation files", () => {
    withTempProject((root) => {
      writeFixture(
        root,
        "docs/advisory.md",
        "GHSA-qwww-vcr4-c8h2: unstable_RSCStaticRouter",
      );

      expect(scanProject(root)).toEqual([]);
    });
  });

  it("ignores dependency directories", () => {
    withTempProject((root) => {
      writeFixture(root, "node_modules/example/entry.mts", '"use server";');

      expect(scanProject(root)).toEqual([]);
    });
  });

  it("ignores test files", () => {
    withTempProject((root) => {
      writeFixture(root, "server/ignored.test.ts", '"use server";');

      expect(scanProject(root)).toEqual([]);
    });
  });
});
