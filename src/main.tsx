// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./LanguageContext.tsx";
import { BrowserRouter } from "react-router-dom";
import AppErrorBoundary, {
  LanguageAwareErrorBoundary,
} from "./Components/AppErrorBoundary.tsx";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error('Unable to mount the application: missing root element "#root".');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <LanguageAwareErrorBoundary>
            <App />
          </LanguageAwareErrorBoundary>
        </BrowserRouter>
      </LanguageProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
