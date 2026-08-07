import type { PageKey } from "../routes/siteRoutes";

export type LocaleScrollContext = {
  pageRatio: number;
  sectionKey: string | null;
  sectionProgress: number | null;
  topAnchor: boolean;
};

export type LocaleSwitchNavigationState = {
  localeSwitch: true;
  scrollContext: LocaleScrollContext;
};

const TOP_ANCHOR_THRESHOLD_PX = 48;

const SECTION_KEYS_BY_PAGE: Record<PageKey, readonly string[]> = {
  home: ["hero", "sobremi", "portfolio", "contacto", "faq"],
  portfolio: [],
  "lem-box": [
    "lem-box-summary",
    "lem-box-challenge",
    "lem-box-role",
    "lem-box-ecosystem",
    "lem-box-audiences",
    "lem-box-solution",
    "lem-box-architecture",
    "lem-box-markets",
    "lem-box-evolution",
    "lem-box-mobile-future",
    "lem-box-public-links",
    "lem-box-final-cta",
  ],
  services: [
    "services-choose",
    "services-directory",
    "services-method",
    "services-coverage",
    "services-proof",
    "services-cta",
  ],
  "business-websites": [
    "business-websites-deliverables",
    "business-websites-cases",
    "business-websites-method",
    "business-websites-crosslink",
    "business-websites-coverage",
    "business-websites-cta",
  ],
  "custom-software": [
    "custom-software-scope",
    "custom-software-proof",
    "custom-software-method",
    "custom-software-crosslink",
    "custom-software-coverage",
    "custom-software-cta",
  ],
  "thank-you": [],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getNavbarHeight(): number {
  const navbar = document.querySelector<HTMLElement>("[data-nojs-navbar]");
  return navbar?.getBoundingClientRect().height ?? 0;
}

function getViewportCenter(navbarHeight: number): number {
  return navbarHeight + (window.innerHeight - navbarHeight) / 2;
}

function getPageRatio(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp(window.scrollY / scrollable, 0, 1);
}

export function captureLocaleScrollContext(
  page: PageKey | null,
): LocaleScrollContext {
  const navbarHeight = getNavbarHeight();
  const pageRatio = getPageRatio();

  if (window.scrollY <= navbarHeight + TOP_ANCHOR_THRESHOLD_PX) {
    return { pageRatio, sectionKey: null, sectionProgress: null, topAnchor: true };
  }

  const sectionKeys = page === null ? [] : SECTION_KEYS_BY_PAGE[page];
  const viewportCenter = getViewportCenter(navbarHeight);

  let bestKey: string | null = null;
  let bestProgress: number | null = null;
  let bestDistance = Infinity;

  for (const key of sectionKeys) {
    const el = document.getElementById(key);
    if (el === null) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) continue;

    const distance =
      viewportCenter < rect.top
        ? rect.top - viewportCenter
        : viewportCenter > rect.bottom
          ? viewportCenter - rect.bottom
          : 0;

    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
      bestProgress = clamp((viewportCenter - rect.top) / rect.height, 0, 1);
    }
    if (distance === 0) break;
  }

  return {
    pageRatio,
    sectionKey: bestKey,
    sectionProgress: bestProgress,
    topAnchor: false,
  };
}

export function isLocaleSwitchNavigationState(
  state: unknown,
): state is LocaleSwitchNavigationState {
  if (typeof state !== "object" || state === null) return false;
  const candidate = state as Record<string, unknown>;
  if (candidate.localeSwitch !== true) return false;
  const scrollContext = candidate.scrollContext;
  return typeof scrollContext === "object" && scrollContext !== null;
}

export function restoreLocaleScrollContext(context: LocaleScrollContext): void {
  if (context.topAnchor) return;

  const navbarHeight = getNavbarHeight();

  if (context.sectionKey !== null && context.sectionProgress !== null) {
    const el = document.getElementById(context.sectionKey);
    if (el !== null) {
      const rect = el.getBoundingClientRect();
      const viewportCenter = getViewportCenter(navbarHeight);
      const targetElementY = rect.top + context.sectionProgress * rect.height;
      const delta = targetElementY - viewportCenter;
      window.scrollTo({ left: 0, top: window.scrollY + delta });
      return;
    }
  }

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable > 0) {
    window.scrollTo({ left: 0, top: context.pageRatio * scrollable });
  }
}
