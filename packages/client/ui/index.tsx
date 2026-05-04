import { createRoot } from "react-dom/client";
import { App } from "./templates/body";

const container = document.getElementById("index");
if (container) {
  createRoot(container).render(<App />);
}
