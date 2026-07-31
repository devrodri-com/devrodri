// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RoutedLanguageProvider } from "./i18n/LanguageProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import AppErrorBoundary, {
  LanguageAwareErrorBoundary,
} from "./Components/AppErrorBoundary.tsx";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error('Unable to mount the application: missing root element "#root".');
}

const application = (
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <RoutedLanguageProvider>
          <LanguageAwareErrorBoundary>
            <App />
          </LanguageAwareErrorBoundary>
        </RoutedLanguageProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, application);
} else {
  ReactDOM.createRoot(rootElement).render(application);
}
