import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import App from "./App.tsx";
import ReactQueryProvider from "@/components/providers/reactquery-provider";
import { ThemeProvider } from "@/components/providers/theme-provider.tsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>
);
