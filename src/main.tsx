import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </AppProvider>
  </React.StrictMode>
);
