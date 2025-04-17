import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ConfigList from "../../components/Configs/ConfigList";
import ChangesPage from "../../components/Configs/Changes";
import InsightsPage from "../../components/Configs/Insights";
import ScrapersPage from "../../components/Configs/Scrapers";
import PluginsPage from "../../components/Configs/Plugins";
import ConfigPageTabs from "../../components/Configs/ConfigPageTabs";

// ...any other relevant imports

export default function CatalogRoutes() {
  // You may have a layout component (e.g., <ConfigPageTabs> etc.)
  // Adjust if wrapping is needed, this is a basic pattern.

  return (
    <Routes>
      <Route path="/" element={<ConfigPageTabs activeTab="Catalog"><ConfigList /></ConfigPageTabs>} />
      <Route path="changes" element={<ConfigPageTabs activeTab="Changes"><ChangesPage /></ConfigPageTabs>} />
      <Route path="insights" element={<ConfigPageTabs activeTab="Insights"><InsightsPage /></ConfigPageTabs>} />
      <Route path="scrapers" element={<ConfigPageTabs activeTab="Scrapers"><ScrapersPage /></ConfigPageTabs>} />
      <Route path="plugins" element={<ConfigPageTabs activeTab="Plugins"><PluginsPage /></ConfigPageTabs>} />
      {/* You might want to handle unknown routes inside catalog */}
      <Route path="*" element={<Navigate to="/catalog" replace />} />
    </Routes>
  );
}