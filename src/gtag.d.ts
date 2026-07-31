type AnalyticsFormMethod = "formsubmit";
type AnalyticsPagePath =
  | import("./routes/siteRoutes").PublicPathname
  | "/404";
type ContactFormErrorType =
  | "validation_error"
  | "network_error"
  | "provider_error";
type AnalyticsClickLabel =
  | "about-cta-primary"
  | "about-cta-secondary"
  | "bridge-cta-afterPortfolio"
  | "cta-email"
  | "cta-start-project"
  | "cta-whatsapp"
  | "impact-cta-primary"
  | "impact-cta-secondary"
  | "portfolio-request-case"
  | "contact-whatsapp";

interface GoogleTagConfig {
  send_page_view: false;
  allow_google_signals: false;
  allow_ad_personalization_signals: false;
}

interface AnalyticsPageViewParameters {
  page_title: string;
  page_location: string;
  page_path: AnalyticsPagePath;
}

interface AnalyticsContactParameters {
  language: import("./i18n/language").Language;
  page_path: AnalyticsPagePath;
  method: AnalyticsFormMethod;
}

interface AnalyticsContactErrorParameters extends AnalyticsContactParameters {
  error_type: ContactFormErrorType;
}

interface AnalyticsContactTimeoutParameters extends AnalyticsContactParameters {
  error_type: "timeout";
}

type GtagCommand =
  | ["js", Date]
  | ["set", "page_location", string]
  | ["config", string, GoogleTagConfig]
  | ["event", "page_view", AnalyticsPageViewParameters]
  | ["event", "click", { label: AnalyticsClickLabel }]
  | ["event", "contact_form_attempt", AnalyticsContactParameters]
  | ["event", "generate_lead", AnalyticsContactParameters]
  | ["event", "contact_form_error", AnalyticsContactErrorParameters]
  | ["event", "contact_form_timeout", AnalyticsContactTimeoutParameters];

type Gtag = (...args: GtagCommand) => void;

interface Window {
  dataLayer?: IArguments[];
  gtag?: Gtag;
}
