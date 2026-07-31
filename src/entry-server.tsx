/* eslint-disable react-refresh/only-export-components */
import React from "react";
import type { FilledContext } from "react-helmet-async";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import AppErrorBoundary, {
  LanguageAwareErrorBoundary,
} from "./Components/AppErrorBoundary";
import { RoutedLanguageProvider } from "./i18n/LanguageProvider";
export { PUBLIC_ROUTES } from "./routes/siteRoutes";

export type ServerHelmetContext = Partial<FilledContext>;

export function createServerApplication(
  url: string,
  helmetContext: ServerHelmetContext,
) {
  return (
    <React.StrictMode>
      <AppErrorBoundary>
        <StaticRouter location={url}>
          <RoutedLanguageProvider>
            <LanguageAwareErrorBoundary>
              <App helmetContext={helmetContext} />
            </LanguageAwareErrorBoundary>
          </RoutedLanguageProvider>
        </StaticRouter>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}
