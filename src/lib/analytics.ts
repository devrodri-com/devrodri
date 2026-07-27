import type { Language } from "../i18n/language";

const GOOGLE_TAG_SCRIPT_ID = "devrodri-google-tag";
const GOOGLE_TAG_CONFIGURED_ATTRIBUTE = "data-devrodri-ga-configured";
const GOOGLE_TAG_ORIGIN = "https://www.googletagmanager.com";
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{10}$/;
const UNKNOWN_ANALYTICS_PATH: AnalyticsPagePath = "/unknown";
const CAMPAIGN_QUERY_KEYS = [
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_source_platform",
  "utm_term",
  "utm_content",
  "utm_creative_format",
  "utm_marketing_tactic",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "srsltid",
] as const;

let hasTrackedPageView = false;

const analyticsClickLabels = new Set<AnalyticsClickLabel>([
  "about-cta-primary",
  "about-cta-secondary",
  "bridge-cta-afterPortfolio",
  "cta-email",
  "cta-start-project",
  "cta-whatsapp",
  "impact-cta-primary",
  "impact-cta-secondary",
  "portfolio-request-case",
  "contact-whatsapp",
]);

function getMeasurementId(): string | null {
  const measurementId = import.meta.env.VITE_GA_ID;
  return measurementId !== undefined &&
    GA_MEASUREMENT_ID_PATTERN.test(measurementId)
    ? measurementId
    : null;
}

function ensureGoogleTagFunction(): Gtag {
  window.dataLayer ??= [];
  window.gtag ??= function () {
    window.dataLayer?.push(arguments.valueOf() as IArguments);
  };
  return window.gtag;
}

function getGoogleTagScript(): HTMLScriptElement | null {
  const existingNode = document.getElementById(GOOGLE_TAG_SCRIPT_ID);
  return existingNode instanceof HTMLScriptElement ? existingNode : null;
}

function createGoogleTagScript(measurementId: string): HTMLScriptElement {
  const script = document.createElement("script");
  script.id = GOOGLE_TAG_SCRIPT_ID;
  script.async = true;
  script.src = `${GOOGLE_TAG_ORIGIN}/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
  return script;
}

function getAnalyticsPath(pathname: string): AnalyticsPagePath {
  const [withoutQueryOrHash = ""] = pathname.split(/[?#]/, 1);
  if (withoutQueryOrHash === "" || withoutQueryOrHash === "/") return "/";
  if (
    withoutQueryOrHash === "/portfolio" ||
    withoutQueryOrHash === "/portfolio/"
  ) {
    return "/portfolio";
  }
  return UNKNOWN_ANALYTICS_PATH;
}

function getCleanPageLocation(pathname: string): string {
  return `${window.location.origin}${getAnalyticsPath(pathname)}`;
}

function getLandingPageLocation(pathname: string): string {
  const pagePath = getAnalyticsPath(pathname);
  if (getAnalyticsPath(window.location.pathname) !== pagePath) {
    return getCleanPageLocation(pagePath);
  }

  const currentSearchParams = new URLSearchParams(window.location.search);
  const campaignSearchParams = new URLSearchParams();

  for (const key of CAMPAIGN_QUERY_KEYS) {
    for (const value of currentSearchParams.getAll(key)) {
      campaignSearchParams.append(key, value);
    }
  }

  const campaignQuery = campaignSearchParams.toString();
  return `${window.location.origin}${pagePath}${
    campaignQuery === "" ? "" : `?${campaignQuery}`
  }`;
}

function setPageLocation(gtag: Gtag, pageLocation: string): void {
  gtag("set", "page_location", pageLocation);
}

function setCleanPageLocation(gtag: Gtag, pathname: string): void {
  setPageLocation(gtag, getCleanPageLocation(pathname));
}

function getContactParameters(
  language: Language,
): AnalyticsContactParameters {
  return {
    language,
    page_path: getAnalyticsPath(window.location.pathname),
    method: "formsubmit",
  };
}

export function initializeAnalytics(): boolean {
  const measurementId = getMeasurementId();
  if (measurementId === null) return false;

  const gtag = ensureGoogleTagFunction();
  const script = getGoogleTagScript() ?? createGoogleTagScript(measurementId);

  if (script.getAttribute(GOOGLE_TAG_CONFIGURED_ATTRIBUTE) !== "true") {
    gtag("js", new Date());
    setCleanPageLocation(gtag, window.location.pathname);
    gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    script.setAttribute(GOOGLE_TAG_CONFIGURED_ATTRIBUTE, "true");
  }

  return true;
}

export function trackPageView(pathname: string): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;

  const pagePath = getAnalyticsPath(pathname);
  const pageLocation = hasTrackedPageView
    ? getCleanPageLocation(pagePath)
    : getLandingPageLocation(pagePath);
  hasTrackedPageView = true;
  setPageLocation(window.gtag, pageLocation);
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: pageLocation,
    page_path: pagePath,
  });
}

export function isAnalyticsClickLabel(
  value: string,
): value is AnalyticsClickLabel {
  return analyticsClickLabels.has(value as AnalyticsClickLabel);
}

export function trackAnalyticsClick(label: AnalyticsClickLabel): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;
  setCleanPageLocation(window.gtag, window.location.pathname);
  window.gtag("event", "click", { label });
}

export function trackContactAttempt(language: Language): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;
  setCleanPageLocation(window.gtag, window.location.pathname);
  window.gtag("event", "contact_form_attempt", getContactParameters(language));
}

export function trackContactSuccess(language: Language): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;
  setCleanPageLocation(window.gtag, window.location.pathname);
  window.gtag("event", "generate_lead", getContactParameters(language));
}

export function trackContactError(
  language: Language,
  errorType: ContactFormErrorType,
): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;
  setCleanPageLocation(window.gtag, window.location.pathname);
  window.gtag("event", "contact_form_error", {
    ...getContactParameters(language),
    error_type: errorType,
  });
}

export function trackContactTimeout(language: Language): void {
  if (!initializeAnalytics() || window.gtag === undefined) return;
  setCleanPageLocation(window.gtag, window.location.pathname);
  window.gtag("event", "contact_form_timeout", {
    ...getContactParameters(language),
    error_type: "timeout",
  });
}
