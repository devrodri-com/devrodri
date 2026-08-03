import type { Language } from "../i18n/language";

const FORM_PROVIDER_ORIGIN = "https://formsubmit.co";
const CONTACT_FORM_RECIPIENT = "r.opalo@icloud.com";

export const CONTACT_FORM_NATIVE_ENDPOINT =
  `${FORM_PROVIDER_ORIGIN}/${CONTACT_FORM_RECIPIENT}`;
export const CONTACT_FORM_AJAX_ENDPOINT =
  `${FORM_PROVIDER_ORIGIN}/ajax/${CONTACT_FORM_RECIPIENT}`;

// Backward-compatible name for the existing AJAX transport contract.
export const CONTACT_FORM_ENDPOINT = CONTACT_FORM_AJAX_ENDPOINT;
export const CONTACT_FORM_TIMEOUT_MS = 15_000;

type AbsoluteHttpsUrl = `https://${string}`;

const CONTACT_FORM_NEXT_BY_LANGUAGE = {
  es: "https://www.devrodri.com/gracias",
  en: "https://www.devrodri.com/en/thank-you",
} as const satisfies Record<Language, AbsoluteHttpsUrl>;

export function getContactFormNextUrl(language: Language): AbsoluteHttpsUrl {
  return CONTACT_FORM_NEXT_BY_LANGUAGE[language];
}

export const CONTACT_FORM_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5_000 },
} as const;

export type ContactFormResult =
  | { status: "success" }
  | { status: "timeout" }
  | { status: "network_error" }
  | { status: "provider_error" }
  | { status: "validation_error" };

export interface ContactFormRequest {
  controller: AbortController;
  result: Promise<ContactFormResult>;
}

const CONTACT_FORM_SUBJECT = "Nuevo mensaje desde devrodri.com";

function getTrimmedField(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : null;
}

function isValidEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.origin === FORM_PROVIDER_ORIGIN &&
      url.protocol === "https:" &&
      url.href === CONTACT_FORM_AJAX_ENDPOINT;
  } catch {
    return false;
  }
}

interface NormalizedContactFields {
  name: string;
  email: string;
  message: string;
}

function normalizeContactFields(
  formData: FormData,
): NormalizedContactFields | null {
  const name = getTrimmedField(formData, "name");
  const email = getTrimmedField(formData, "email");
  const message = getTrimmedField(formData, "message");

  if (name === null || email === null || message === null) return null;
  if (
    name.length < CONTACT_FORM_LIMITS.name.min ||
    name.length > CONTACT_FORM_LIMITS.name.max ||
    email.length === 0 ||
    email.length > CONTACT_FORM_LIMITS.email.max ||
    message.length < CONTACT_FORM_LIMITS.message.min ||
    message.length > CONTACT_FORM_LIMITS.message.max
  ) {
    return null;
  }

  return { name, email, message };
}

function buildProviderPayload(
  source: FormData,
  fields: NormalizedContactFields,
): FormData {
  const payload = new FormData();
  payload.set("name", fields.name);
  payload.set("email", fields.email);
  payload.set("message", fields.message);
  payload.set("_captcha", "false");
  payload.set("_subject", CONTACT_FORM_SUBJECT);

  const honeypot = source.get("_honey");
  payload.set("_honey", typeof honeypot === "string" ? honeypot : "");

  return payload;
}

async function performContactFormRequest(
  endpoint: string,
  formData: FormData,
  controller: AbortController,
): Promise<ContactFormResult> {
  if (!isValidEndpoint(endpoint)) return { status: "provider_error" };
  const normalizedFields = normalizeContactFields(formData);
  if (normalizedFields === null) {
    return { status: "validation_error" };
  }
  const payload = buildProviderPayload(formData, normalizedFields);

  let timedOut = false;
  const timeoutId = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, CONTACT_FORM_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    return response.ok ? { status: "success" } : { status: "provider_error" };
  } catch {
    return timedOut ? { status: "timeout" } : { status: "network_error" };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export function submitContactForm(
  endpoint: string,
  formData: FormData,
): ContactFormRequest {
  const controller = new AbortController();
  return {
    controller,
    result: performContactFormRequest(endpoint, formData, controller),
  };
}
