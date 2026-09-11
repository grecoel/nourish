import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./analytics.css";
import "./atlas.css";
import "./map-fix.css";
import "./experience.css";
import "./workspace-v2.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
