import type { Language } from "../../i18n/language";

export type Localized<T> = {
  readonly [Locale in Language]: T;
};

export type ProjectCategory = "systems" | "web" | "ecommerce" | "brand";

export type PortfolioAction = {
  href: string;
  label: Localized<string>;
  note?: Localized<string>;
};

export type PortfolioCaseDetails = {
  summary: string;
  stack: readonly string[];
  stackLabel?: string;
  integrations: readonly string[];
  integrationsLabel?: string;
  challenges: readonly string[];
  solution: readonly string[];
  impact: readonly string[];
};

export type PortfolioCaseContent = {
  title: string;
  description: string;
  tags: readonly string[];
  status?: string;
  disclaimer?: string;
  role?: string;
  details: PortfolioCaseDetails;
};

export type PortfolioCaseDefinition<Key extends string> = {
  key: Key;
  portfolioOrder: number;
  category: ProjectCategory;
  cover: string;
  actions: readonly PortfolioAction[];
  content: Localized<PortfolioCaseContent>;
  home?: {
    order: number;
    summary: Localized<string>;
  };
};

export function definePortfolioCase<const Key extends string>(
  portfolioCase: PortfolioCaseDefinition<Key>,
): PortfolioCaseDefinition<Key> {
  return portfolioCase;
}
