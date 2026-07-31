import { Component, Fragment, type ReactNode } from "react";
import type { Language } from "../i18n/language";
import { useLanguage } from "../i18n/useLanguage";

type AppErrorBoundaryProps = {
  children: ReactNode;
  language?: Language;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  recoveryKey: number;
};

const recoveryCopy = {
  es: {
    title: "Algo salió mal",
    message:
      "No pudimos mostrar esta página. Podés reintentar, recargar o volver al inicio.",
    retry: "Reintentar",
    reload: "Recargar",
    home: "Volver al inicio",
  },
  en: {
    title: "Something went wrong",
    message:
      "We couldn't display this page. You can retry, reload, or return home.",
    retry: "Retry",
    reload: "Reload",
    home: "Return home",
  },
  bilingual: {
    title: "Algo salió mal / Something went wrong",
    message:
      "Reintentá, recargá o volvé al inicio. Retry, reload, or return home.",
    retry: "Reintentar / Retry",
    reload: "Recargar / Reload",
    home: "Inicio / Home",
  },
} as const;

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    recoveryKey: 0,
  };

  static getDerivedStateFromError(): Pick<
    AppErrorBoundaryState,
    "hasError"
  > {
    return { hasError: true };
  }

  private retry = (): void => {
    this.setState((state) => ({
      hasError: false,
      recoveryKey: state.recoveryKey + 1,
    }));
  };

  private reload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const copy =
        this.props.language === undefined
          ? recoveryCopy.bilingual
          : recoveryCopy[this.props.language];

      return (
        <div
          className="min-h-screen bg-black px-6 py-24 text-white flex items-center justify-center"
          role="alert"
        >
          <div className="w-full max-w-xl text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              devrodri
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">{copy.title}</h1>
            <p className="mt-5 text-gray-300 leading-relaxed">
              {copy.message}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.retry}
                className="min-h-[44px] rounded-full bg-primary-on-light px-6 py-3 font-medium text-white hover:bg-primary-on-light-hover transition"
              >
                {copy.retry}
              </button>
              <button
                type="button"
                onClick={this.reload}
                className="min-h-[44px] rounded-full border border-white/40 px-6 py-3 font-medium text-white hover:border-white transition"
              >
                {copy.reload}
              </button>
              <a
                href="/"
                className="min-h-[44px] inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-medium text-white hover:border-white transition"
              >
                {copy.home}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Fragment key={this.state.recoveryKey}>
        {this.props.children}
      </Fragment>
    );
  }
}

export function LanguageAwareErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const { language } = useLanguage();
  return (
    <AppErrorBoundary language={language}>
      {children}
    </AppErrorBoundary>
  );
}
