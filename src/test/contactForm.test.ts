import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_FORM_ENDPOINT,
  CONTACT_FORM_LIMITS,
  CONTACT_FORM_TIMEOUT_MS,
  submitContactForm,
} from "../services/contactForm";

function validFormData(): FormData {
  const formData = new FormData();
  formData.set("name", "  Rodrigo  ");
  formData.set("email", "  rodrigo@example.com  ");
  formData.set("message", "  Este es un mensaje de prueba.  ");
  formData.set("_captcha", "false");
  formData.set("_honey", "");
  return formData;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("contact form transport", () => {
  it("trims valid fields and submits once with an AbortController signal", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const request = submitContactForm(
      CONTACT_FORM_ENDPOINT,
      validFormData(),
    );

    await expect(request.result).resolves.toEqual({ status: "success" });
    expect(request.controller).toBeInstanceOf(AbortController);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
    expect(requestInit?.signal).toBe(request.controller.signal);
    expect(requestInit?.method).toBe("POST");
    expect(requestInit?.headers).toEqual({ Accept: "application/json" });

    const body = requestInit?.body;
    expect(body).toBeInstanceOf(FormData);
    if (!(body instanceof FormData)) {
      throw new Error("Expected a FormData request body");
    }
    expect(body.get("name")).toBe("Rodrigo");
    expect(body.get("email")).toBe("rodrigo@example.com");
    expect(body.get("message")).toBe("Este es un mensaje de prueba.");
    expect(body.get("_captcha")).toBe("false");
    expect(body.get("_subject")).toBe("Nuevo mensaje desde devrodri.com");
    expect(body.get("_honey")).toBe("");
  });

  it("drops fields outside the provider payload allowlist", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const formData = validFormData();
    formData.set("_cc", "private@example.com");
    formData.set("_webhook", "https://example.com/private");
    formData.set("unexpected_personal_data", "PRIVATE_VALUE");

    await expect(
      submitContactForm(CONTACT_FORM_ENDPOINT, formData).result,
    ).resolves.toEqual({ status: "success" });

    const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
    const body = requestInit?.body;
    expect(body).toBeInstanceOf(FormData);
    if (!(body instanceof FormData)) {
      throw new Error("Expected a FormData request body");
    }
    expect(body.get("_cc")).toBeNull();
    expect(body.get("_webhook")).toBeNull();
    expect(body.get("unexpected_personal_data")).toBeNull();
  });

  it.each([
    ["name", "R"],
    ["name", "R".repeat(CONTACT_FORM_LIMITS.name.max + 1)],
    ["email", `r@e.co${"x".repeat(CONTACT_FORM_LIMITS.email.max)}`],
    ["message", "short"],
    ["message", "M".repeat(CONTACT_FORM_LIMITS.message.max + 1)],
  ])("rejects invalid %s limits before fetch", async (field, value) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("fetch must not run"));
    const formData = validFormData();
    formData.set(field, value);

    await expect(
      submitContactForm(CONTACT_FORM_ENDPOINT, formData).result,
    ).resolves.toEqual({ status: "validation_error" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects a changed provider endpoint before fetch", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("fetch must not run"));

    await expect(
      submitContactForm(
        "https://formsubmit.co/ajax/other@example.com",
        validFormData(),
      ).result,
    ).resolves.toEqual({ status: "provider_error" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("classifies a non-success provider response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("provider detail", { status: 503 }),
    );

    await expect(
      submitContactForm(CONTACT_FORM_ENDPOINT, validFormData()).result,
    ).resolves.toEqual({ status: "provider_error" });
  });

  it("classifies a network failure without exposing its details", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("PRIVATE_NETWORK_DETAIL"),
    );

    await expect(
      submitContactForm(CONTACT_FORM_ENDPOINT, validFormData()).result,
    ).resolves.toEqual({ status: "network_error" });
  });

  it("aborts and classifies a request that reaches the timeout", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((_input, requestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          requestInit?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        });
      });
    const request = submitContactForm(
      CONTACT_FORM_ENDPOINT,
      validFormData(),
    );

    await vi.advanceTimersByTimeAsync(CONTACT_FORM_TIMEOUT_MS);

    await expect(request.result).resolves.toEqual({ status: "timeout" });
    expect(request.controller.signal.aborted).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
