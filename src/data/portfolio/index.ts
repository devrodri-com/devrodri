import { magentaCase } from "./cases/magenta";
import { estebanCase } from "./cases/esteban";
import { lemWebCase } from "./cases/lemWeb";
import { lemPortalCase } from "./cases/lemPortal";
import { mutterCase } from "./cases/mutter";
import { federicoCase } from "./cases/federico";
import { boatingCase } from "./cases/boating";
import { campingsDemoCase } from "./cases/campingsDemo";
import type { Localized, ProjectCategory } from "./types";

const registeredCases = [
  magentaCase,
  estebanCase,
  lemWebCase,
  lemPortalCase,
  mutterCase,
  federicoCase,
  boatingCase,
  campingsDemoCase,
] as const;

export type ProjectKey = (typeof registeredCases)[number]["key"];
export type PortfolioCase = (typeof registeredCases)[number];
export type Category = "all" | ProjectCategory;

export const portfolioCases: PortfolioCase[] = [...registeredCases].sort(
  (first, second) => first.portfolioOrder - second.portfolioOrder,
);

function hasHome(
  portfolioCase: PortfolioCase,
): portfolioCase is PortfolioCase & {
  home: NonNullable<PortfolioCase["home"]>;
} {
  return portfolioCase.home !== undefined;
}

export const homePortfolioCases = portfolioCases
  .filter(hasHome)
  .sort((first, second) => first.home.order - second.home.order);

export const filters = [
  { key: "all", label: { es: "Todos", en: "All" } },
  { key: "ecom", label: { es: "E‑commerce", en: "E‑commerce" } },
  { key: "personal", label: { es: "Personal", en: "Personal" } },
  { key: "services", label: { es: "Servicios", en: "Services" } },
] satisfies readonly { key: Category; label: Localized<string> }[];

export const projectKeys = portfolioCases.map(({ key }) => key);
const projectKeySet = new Set<string>(projectKeys);

export function isProjectKey(value: unknown): value is ProjectKey {
  return typeof value === "string" && projectKeySet.has(value);
}

export const initialExpandedState = Object.fromEntries(
  projectKeys.map((key) => [key, false]),
) as Record<ProjectKey, boolean>;

export type { ProjectCategory } from "./types";
