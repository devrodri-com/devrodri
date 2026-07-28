import { magentaCase } from "./cases/magenta";
import { estebanCase } from "./cases/esteban";
import { lemBoxCase } from "./cases/lemBox";
import { zentraCase } from "./cases/zentra";
import { mutterCase } from "./cases/mutter";
import { federicoCase } from "./cases/federico";
import { boatingCase } from "./cases/boating";
import { campingsDemoCase } from "./cases/campingsDemo";
import type { Localized, ProjectCategory } from "./types";

const registeredCases = [
  lemBoxCase,
  zentraCase,
  estebanCase,
  mutterCase,
  magentaCase,
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
  { key: "systems", label: { es: "Sistemas", en: "Systems" } },
  { key: "web", label: { es: "Sitios web", en: "Websites" } },
  { key: "ecommerce", label: { es: "E-commerce", en: "E-commerce" } },
  { key: "brand", label: { es: "Marca", en: "Brand" } },
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
