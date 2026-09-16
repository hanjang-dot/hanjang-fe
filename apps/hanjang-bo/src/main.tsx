import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import Providers from "@/app/providers";
import { router } from "@/app/router";

import "@/app/styles/globals.css";

const App = () => (
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);

createRoot(document.getElementById("root")!).render(<App />);
