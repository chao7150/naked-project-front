import { createRoot } from "react-dom/client";
import { App } from "./templates/body";
import "./styles.css";

const container = document.getElementById("index");
if (container) {
  createRoot(container).render(<App />);
}
