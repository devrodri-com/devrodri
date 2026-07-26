import { describe, expect, it } from "vitest";

const policyTestName = "reactRouterRscPolicy.test.ts";
const authoredFiles = import.meta.glob(
  [
    "../**/*.{cjs,html,js,jsx,mjs,rsc,ts,tsx}",
    "../../*.{cjs,html,js,jsx,mjs,rsc,ts,tsx}",
    "../../package.json",
  ],
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);

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

describe("React Router RSC advisory policy", () => {
  it("fails when an explicit RSC architecture signal is introduced", () => {
    const sourceViolations = Object.entries(authoredFiles).flatMap(
      ([filePath, importedContent]) => {
        if (filePath.endsWith(policyTestName)) return [];
        if (typeof importedContent !== "string") {
          return [`${filePath}: source could not be inspected`];
        }

        const signalMatches = forbiddenSourceSignals
          .filter(
            (signal) =>
              filePath.includes(signal) || importedContent.includes(signal),
          )
          .map((signal) => `${filePath}: ${signal}`);
        const serverDirective = /["']use server["']/.test(importedContent)
          ? [`${filePath}: use server directive`]
          : [];

        return [...signalMatches, ...serverDirective];
      },
    );

    const packageEntry = Object.entries(authoredFiles).find(([filePath]) =>
      filePath.endsWith("/package.json"),
    );
    const packageJson: unknown =
      packageEntry && typeof packageEntry[1] === "string"
        ? JSON.parse(packageEntry[1])
        : null;
    const dependencyGroups = isRecord(packageJson)
      ? [packageJson.dependencies, packageJson.devDependencies]
      : [];
    const declaredDependencies = new Set(
      dependencyGroups
        .filter(isRecord)
        .flatMap((dependencies) => Object.keys(dependencies)),
    );
    const dependencyViolations = forbiddenDirectDependencies
      .filter((dependency) => declaredDependencies.has(dependency))
      .map((dependency) => `package.json: ${dependency}`);

    expect([...sourceViolations, ...dependencyViolations]).toEqual([]);
  });
});
