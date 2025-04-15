import { createRoot } from "react-dom/client"; // ✅ Ensure this is correct

import App from "./App";
import { StrictMode } from "react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)