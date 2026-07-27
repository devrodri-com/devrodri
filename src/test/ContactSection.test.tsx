import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactSection from "../Components/ContactSection";
import { LanguageProvider } from "../i18n/LanguageProvider";
import type { Language } from "../i18n/language";
import {
  CONTACT_FORM_ENDPOINT,
  CONTACT_FORM_LIMITS,
} from "../services/contactForm";
import {
  trackContactAttempt,
  trackContactError,
  trackContactSuccess,
} from "../lib/analytics";

vi.mock("../lib/analytics", () => ({
  trackContactAttempt: vi.fn(),
  trackContactError: vi.fn(),
  trackContactSuccess: vi.fn(),
  trackContactTimeout: vi.fn(),
}));

function renderContactSection(language: Language = "es") {
  localStorage.setItem("language", language);
  return render(
    <LanguageProvider>
      <ContactSection />
    </LanguageProvider>,
  );
}

async function fillContactForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nombre"), "Rodrigo");
  await user.type(screen.getByLabelText("Correo electrónico"), "rodrigo@example.com");
  await user.type(
    screen.getByLabelText("Mensaje"),
    "Este es un mensaje de prueba.",
  );
  return user;
}

describe("ContactSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps required fields, limits, captcha choice, and honeypot", () => {
    renderContactSection();

    const name = screen.getByLabelText("Nombre");
    const email = screen.getByLabelText("Correo electrónico");
    const message = screen.getByLabelText("Mensaje");
    const form = name.closest("form");

    expect(name).toBeRequired();
    expect(name).toHaveAttribute(
      "minlength",
      String(CONTACT_FORM_LIMITS.name.min),
    );
    expect(name).toHaveAttribute(
      "maxlength",
      String(CONTACT_FORM_LIMITS.name.max),
    );
    expect(email).toBeRequired();
    expect(email).toHaveAttribute(
      "maxlength",
      String(CONTACT_FORM_LIMITS.email.max),
    );
    expect(message).toBeRequired();
    expect(message).toHaveAttribute(
      "minlength",
      String(CONTACT_FORM_LIMITS.message.min),
    );
    expect(message).toHaveAttribute(
      "maxlength",
      String(CONTACT_FORM_LIMITS.message.max),
    );
    expect(form).toHaveAttribute("action", CONTACT_FORM_ENDPOINT);
    expect(
      form?.querySelector('input[name="_captcha"]'),
    ).toHaveAttribute("value", "false");
    expect(form?.querySelector('input[name="_honey"]')).toBeInTheDocument();
  });

  it("shows success after a simulated successful response", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    renderContactSection();
    const user = await fillContactForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText("¡Gracias por tu mensaje! Te responderé pronto."),
    ).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      CONTACT_FORM_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        headers: { Accept: "application/json" },
        signal: expect.any(AbortSignal),
      }),
    );
    expect(trackContactAttempt).toHaveBeenCalledWith("es");
    expect(trackContactSuccess).toHaveBeenCalledWith("es");
  });

  it("shows a safe error after a simulated rejection", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("PRIVATE_STACK_DETAIL"),
    );
    renderContactSection();
    const user = await fillContactForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText(
        "No pudimos enviar el mensaje. Probá nuevamente o escribime a r.opalo@icloud.com",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/PRIVATE_STACK_DETAIL/)).not.toBeInTheDocument();
    expect(trackContactAttempt).toHaveBeenCalledWith("es");
    expect(trackContactError).toHaveBeenCalledWith("es", "network_error");
  });

  it("classifies a simulated provider error without technical detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("PRIVATE_PROVIDER_DETAIL", { status: 500 }),
    );
    renderContactSection();
    const user = await fillContactForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText(
        "No pudimos enviar el mensaje. Probá nuevamente o escribime a r.opalo@icloud.com",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/PRIVATE_PROVIDER_DETAIL/)).not.toBeInTheDocument();
    expect(trackContactError).toHaveBeenCalledWith("es", "provider_error");
  });

  it("disables submit while the simulated request is pending", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    vi.spyOn(globalThis, "fetch").mockReturnValue(pendingResponse);
    renderContactSection();
    const user = await fillContactForm();
    const submit = screen.getByRole("button", { name: "Enviar mensaje" });

    await user.click(submit);
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");

    if (!resolveRequest) throw new Error("Expected pending request resolver");
    resolveRequest(new Response("{}", { status: 200 }));

    await waitFor(() => expect(submit).toBeEnabled());
  });

  it("aborts an active request when the form unmounts", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(() => new Promise<Response>(() => {}));
    const rendered = renderContactSection();
    const user = await fillContactForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
    const requestSignal = requestInit?.signal;
    expect(requestSignal).not.toBeNull();

    rendered.unmount();

    expect(requestSignal?.aborted).toBe(true);
  });

  it("shows the exact privacy disclosure in Spanish and English", async () => {
    const spanish = renderContactSection("es");
    expect(
      screen.getByText(
        "Al enviar este formulario, tu nombre, email y mensaje se usarán únicamente para responder tu consulta. El envío se procesa mediante FormSubmit. Google Analytics mide el uso general del sitio, pero no recibe el contenido del formulario.",
      ),
    ).toBeInTheDocument();
    spanish.unmount();

    renderContactSection("en");
    expect(
      await screen.findByText(
        "When you submit this form, your name, email and message are used only to reply to your inquiry. The submission is processed through FormSubmit. Google Analytics measures general site usage and does not receive the form contents.",
      ),
    ).toBeInTheDocument();
  });
});
