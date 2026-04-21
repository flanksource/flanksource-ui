import { createRoot } from "react-dom/client";
import { ScrapeRunViewer } from "./ScrapeRunViewer";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ScrapeRunViewer artifactId="019da90b-3e48-5b01-e073-1f155e1ac297" />
  );
}
