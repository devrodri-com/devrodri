import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lazy, Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppErrorBoundary from "../Components/AppErrorBoundary";

function BrokenComponent(): never {
  throw new Error("PRIVATE_STACK_DETAIL");
}

describe("AppErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("captures render errors without exposing technical details", () => {
    render(
      <AppErrorBoundary language="es">
        <BrokenComponent />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Algo salió mal" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/PRIVATE_STACK_DETAIL/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Volver al inicio" }),
    ).toHaveAttribute("href", "/");
  });

  it("resets the boundary when retrying after the cause is removed", async () => {
    const user = userEvent.setup();
    const rendered = render(
      <AppErrorBoundary language="es">
        <BrokenComponent />
      </AppErrorBoundary>,
    );
    rendered.rerender(
      <AppErrorBoundary language="es">
        <p>Contenido recuperado</p>
      </AppErrorBoundary>,
    );

    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(screen.getByText("Contenido recuperado")).toBeInTheDocument();
  });

  it("renders a safe English recovery fallback", () => {
    render(
      <AppErrorBoundary language="en">
        <BrokenComponent />
      </AppErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("captures a rejected lazy chunk without exposing its error", async () => {
    const LazyFailure = lazy(() =>
      Promise.reject(new Error("PRIVATE_LAZY_CHUNK_DETAIL")),
    );
    render(
      <AppErrorBoundary language="en">
        <Suspense fallback={<p>Loading</p>}>
          <LazyFailure />
        </Suspense>
      </AppErrorBoundary>,
    );

    expect(
      await screen.findByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/PRIVATE_LAZY_CHUNK_DETAIL/),
    ).not.toBeInTheDocument();
  });
});
