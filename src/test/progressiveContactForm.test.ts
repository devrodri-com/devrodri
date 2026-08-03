import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_FORM_AJAX_ENDPOINT,
  CONTACT_FORM_ENDPOINT,
  CONTACT_FORM_NATIVE_ENDPOINT,
  getContactFormNextUrl,
  submitContactForm,
} from "../services/contactForm";

interface HashApi {
  digest(encoding: "hex"): string;
  update(value: string): HashApi;
}

interface CryptoApi {
  createHash(algorithm: "sha256"): HashApi;
}

const crypto = await vi.importActual<CryptoApi>("node:crypto");

function validFormData(): FormData {
  const formData = new FormData();
  formData.set("name", "Rodrigo");
  formData.set("email", "rodrigo@example.com");
  formData.set("message", "Este es un mensaje de prueba.");
  formData.set("_captcha", "false");
  formData.set("_subject", "Nuevo mensaje desde devrodri.com");
  formData.set("_honey", "");
  formData.set("_next", getContactFormNextUrl("es"));
  return formData;
}

describe("progressive contact form contract", () => {
  it("derives both transports from the approved private recipient", () => {
    const nativeUrl = new URL(CONTACT_FORM_NATIVE_ENDPOINT);
    const ajaxUrl = new URL(CONTACT_FORM_AJAX_ENDPOINT);
    const encodedRecipient = nativeUrl.pathname.slice(1);
    const recipient = decodeURIComponent(encodedRecipient);

    expect(nativeUrl.origin).toBe("https://formsubmit.co");
    expect(ajaxUrl.origin).toBe(nativeUrl.origin);
    expect(ajaxUrl.pathname).toBe(`/ajax/${encodedRecipient}`);
    expect(CONTACT_FORM_ENDPOINT).toBe(CONTACT_FORM_AJAX_ENDPOINT);
    expect(
      crypto.createHash("sha256").update(recipient).digest("hex").slice(0, 12),
    ).toBe("edbffbac7500");
  });

  it.each([
    ["es", "https://www.devrodri.com/gracias"],
    ["en", "https://www.devrodri.com/en/thank-you"],
  ] as const)(
    "keeps the %s native redirect absolute and constant",
    (language, expected) => {
      const nextUrl = getContactFormNextUrl(language);
      const parsed = new URL(nextUrl);

      expect(nextUrl).toBe(expected);
      expect(parsed.protocol).toBe("https:");
      expect(parsed.host).toBe("www.devrodri.com");
      expect(parsed.search).toBe("");
      expect(parsed.hash).toBe("");
      expect(parsed.username).toBe("");
      expect(parsed.password).toBe("");
    },
  );

  it("sends exactly the six approved fields to the explicit AJAX endpoint", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const formData = validFormData();
    formData.set("unexpected", "not-sent");

    await expect(
      submitContactForm(CONTACT_FORM_AJAX_ENDPOINT, formData).result,
    ).resolves.toEqual({ status: "success" });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [endpoint, requestInit] = fetchSpy.mock.calls[0] ?? [];
    expect(endpoint).toBe(CONTACT_FORM_AJAX_ENDPOINT);
    expect(requestInit).toMatchObject({
      method: "POST",
      headers: { Accept: "application/json" },
    });

    const body = requestInit?.body;
    expect(body).toBeInstanceOf(FormData);
    if (!(body instanceof FormData)) {
      throw new Error("Expected a FormData request body");
    }

    expect([...body.keys()].sort()).toEqual(
      ["name", "email", "message", "_captcha", "_subject", "_honey"].sort(),
    );
    expect(body.get("_next")).toBeNull();
    expect(body.get("unexpected")).toBeNull();
  });

  it("keeps the request abortable without issuing a second request", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((_input, requestInit) =>
        new Promise<Response>((_resolve, reject) => {
          requestInit?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
      );
    const request = submitContactForm(
      CONTACT_FORM_AJAX_ENDPOINT,
      validFormData(),
    );

    request.controller.abort();

    await expect(request.result).resolves.toEqual({ status: "network_error" });
    expect(request.controller.signal.aborted).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
