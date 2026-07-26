import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactSection from "../Components/ContactSection";
import { LanguageProvider } from "../LanguageContext";

function renderContactSection() {
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
    localStorage.setItem("language", "es");
  });

  it("marks the public form fields as required", () => {
    renderContactSection();

    expect(screen.getByLabelText("Nombre")).toBeRequired();
    expect(screen.getByLabelText("Correo electrónico")).toBeRequired();
    expect(screen.getByLabelText("Mensaje")).toBeRequired();
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
      "https://formsubmit.co/ajax/r.opalo@icloud.com",
      expect.objectContaining({
        method: "POST",
        headers: { Accept: "application/json" },
      }),
    );
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
});
