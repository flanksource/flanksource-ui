import { createRoot } from "react-dom/client";
import { ScrapeRunViewer } from "./ScrapeRunViewer";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ScrapeRunViewer jobHistoryId="019daf9c-5d3e-f8ee-ae13-be5218b0e729" />
  );
}
