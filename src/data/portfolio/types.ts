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

export type PortfolioCaseStudyTextSection = {
  title: string;
  text: string;
};

export type PortfolioCaseStudyItem = {
  title: string;
  text: string;
};

export type PortfolioCaseStudyContent = {
  seo: {
    title: string;
    description: string;
  };
  header: {
    badges: readonly [string, string];
    subtitle: string;
    coverAlt: string;
    backLabel: string;
    homeCta: string;
    portfolioCta: string;
  };
  summary: PortfolioCaseStudyTextSection & {
    clarification: string;
  };
  challenge: PortfolioCaseStudyTextSection;
  role: PortfolioCaseStudyTextSection;
  ecosystem: {
    title: string;
    items: readonly PortfolioCaseStudyItem[];
  };
  audiences: {
    title: string;
    items: readonly PortfolioCaseStudyItem[];
  };
  solution: PortfolioCaseStudyTextSection;
  architecture: PortfolioCaseStudyTextSection & {
    stackLabel: string;
  };
  markets: PortfolioCaseStudyTextSection;
  evolution: PortfolioCaseStudyTextSection & {
    qualityTitle: string;
    qualityText: string;
  };
  mobileFuture: PortfolioCaseStudyTextSection;
  currentState: PortfolioCaseStudyTextSection;
  publicLinksTitle: string;
  finalCta: PortfolioCaseStudyTextSection & {
    buttonLabel: string;
  };
};

export type PortfolioCaseStudy<Slug extends string = string> = {
  slug: Slug;
  path: `/portfolio/${Slug}`;
  coverWidth: number;
  coverHeight: number;
  stack: readonly string[];
  publicLinks: readonly PortfolioAction[];
  finalCtaHref: string;
  content: Localized<PortfolioCaseStudyContent>;
};

export type PortfolioCaseContent = {
  title: string;
  description: string;
  tags: readonly string[];
  status?: string;
  disclaimer?: string;
  role?: string;
  details?: PortfolioCaseDetails;
};

type PortfolioCaseStudyCardContent = Omit<PortfolioCaseContent, "details"> & {
  details?: never;
};

type PortfolioExpandableCaseContent = PortfolioCaseContent & {
  details: PortfolioCaseDetails;
};

type PortfolioCaseDefinitionBase<
  Key extends string,
  Content extends PortfolioCaseContent,
> = {
  key: Key;
  portfolioOrder: number;
  category: ProjectCategory;
  cover: string;
  actions: readonly PortfolioAction[];
  content: Localized<Content>;
  home?: {
    order: number;
    summary: Localized<string>;
  };
};

export type PortfolioCaseWithStudyDefinition<
  Key extends string,
  Slug extends string = string,
> = PortfolioCaseDefinitionBase<Key, PortfolioCaseStudyCardContent> & {
  caseStudy: PortfolioCaseStudy<Slug>;
};

export type PortfolioExpandableCaseDefinition<Key extends string> =
  PortfolioCaseDefinitionBase<Key, PortfolioExpandableCaseContent> & {
    caseStudy?: undefined;
  };

export type PortfolioCaseDefinition<Key extends string> =
  | PortfolioCaseWithStudyDefinition<Key>
  | PortfolioExpandableCaseDefinition<Key>;

export function definePortfolioCase<
  const Key extends string,
  const Slug extends string,
>(
  portfolioCase: PortfolioCaseWithStudyDefinition<Key, Slug>,
): PortfolioCaseWithStudyDefinition<Key, Slug>;
export function definePortfolioCase<const Key extends string>(
  portfolioCase: PortfolioExpandableCaseDefinition<Key>,
): PortfolioExpandableCaseDefinition<Key>;
export function definePortfolioCase<const Key extends string>(
  portfolioCase: PortfolioCaseDefinition<Key>,
): PortfolioCaseDefinition<Key> {
  return portfolioCase;
}
