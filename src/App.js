import { Routes, Route, Navigate } from "react-router-dom";

import { FolderIcon, HomeIcon } from "@heroicons/react/outline";

import { ImLifebuoy } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { TraceView } from "./components/Traces";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { IncidentDetailsPage } from "./pages/TopologyViewer/Incident/IncidentDetails";
import { IncidentListPage } from "./pages/TopologyViewer/Incident/IncidentList";
import SidebarLayout from "./components/Layout/sidebar";
import { LogsViewer } from "./components/Logs";
import { TopologyPageSmall } from "./pages/Examples/TopologyPageSmall/TopologyPageSmall";
import { TopologyPageLarge } from "./pages/Examples/TopologyPageLarge/TopologyPageLarge";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
    current: false
  },
  {
    name: "Health",
    href: "/health",
    icon: AiFillHeart,
    current: false
  },
  { name: "Logs", href: "/logs", icon: FolderIcon, current: false },
  { name: "Metrics", href: "/metrics", icon: VscGraph, current: false },
  { name: "Traces", href: "/traces", icon: FaProjectDiagram, current: false },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ImLifebuoy,
    current: true
  }
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" }
];

export function Placeholder({ text }) {
  return (
    <div className="py-4">
      <div className="h-96 border-4 border-dashed border-gray-200 rounded-lg">
        {text}
      </div>
    </div>
  );
}

export function App() {
  const sidebar = (
    <SidebarLayout navigation={navigation} userNavigation={userNavigation} />
  );
  return (
    <Routes path="/" element={sidebar}>
      <Route path="" element={<Navigate to="/topology" />} />
      <Route path="incidents" element={sidebar}>
        <Route path=":id" element={<IncidentDetailsPage />} />
        <Route index element={<IncidentListPage />} />
      </Route>
      <Route path="health" element={sidebar}>
        <Route index element={<CanaryPage url="/canary/api" />} />
      </Route>

      <Route path="topology" element={sidebar}>
        <Route index element={<TopologyPageMedium url="/canary/api" />} />
      </Route>

      <Route path="topology-small" element={sidebar}>
        <Route index element={<TopologyPageSmall url="/canary/api" />} />
      </Route>

      <Route path="topology-medium" element={sidebar}>
        <Route index element={<TopologyPageMedium url="/canary/api" />} />
      </Route>

      <Route path="topology-large" element={sidebar}>
        <Route index element={<TopologyPageLarge url="/canary/api" />} />
      </Route>

      <Route path="logs" element={sidebar}>
        <Route index element={<LogsViewer />} />
      </Route>

      <Route path="metrics" element={sidebar}>
        <Route index element={<Placeholder text="metrics" />} />
      </Route>
      <Route path="layout">
        <Route index element={sidebar} />
      </Route>
      <Route path="traces" element={sidebar}>
        <Route index element={<TraceView />} />
      </Route>
    </Routes>
  );
}
