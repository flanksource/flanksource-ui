import { FolderIcon, HomeIcon } from "@heroicons/react/outline";

import { ImLifebuoy } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageSmall } from "./pages/Examples/TopologyPageSmall/TopologyPageSmall";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { TopologyPageLarge } from "./pages/Examples/TopologyPageLarge/TopologyPageLarge";
import { HeirarchyTestPageOld } from "./pages/Examples/heirarchyTestOld";
import { IncidentDetailsPage } from "./pages/TopologyViewer/Incident/IncidentDetails";
import { IncidentListPage } from "./pages/TopologyViewer/Incident/IncidentList";
import SidebarLayout from "./components/Layout/sidebar";

const navigation = [
  {
    name: "Dashboard",
    href: "#",
    icon: HomeIcon,
    current: false,
    body: <TopologyPageMedium />
  },
  {
    name: "Health",
    href: "#health",
    icon: AiFillHeart,
    current: false,
    body: <CanaryPage />
  },
  { name: "Logs", href: "#logs", icon: FolderIcon, current: false },
  { name: "Metrics", href: "#metrics", icon: VscGraph, current: false },
  { name: "Traces", href: "#traces", icon: FaProjectDiagram, current: false },
  {
    name: "Incidents",
    href: "#incidents",
    icon: ImLifebuoy,
    current: true,
    body: <IncidentListPage />
  }
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" }
];

export const routes = {
  examples: {
    name: "Examples",
    path: `/examples`,
    component: <Examples />
  },
  layout: {
    name: "Layout",
    exact: true,
    path: `/layout`,
    component: (
      <SidebarLayout navigation={navigation} userNavigation={userNavigation} />
    )
  },
  topology: {
    name: "Topology",
    path: "/",
    useSidebarLayout: "true",
    component: <TopologyViewer url="/canary/api" />
  },
  topologySmall: {
    name: "TopologySmall",
    path: `/topology-small`,
    useSidebarLayout: "true",
    component: <TopologyPageSmall url="/canary/api" />
  },
  topologyMedium: {
    name: "TopologyMedium",
    path: `/topology-medium`,
    useSidebarLayout: "true",
    component: <TopologyPageMedium url="/canary/api" />
  },
  topologyLarge: {
    name: "TopologyLarge",
    path: `/topology-large`,
    useSidebarLayout: "true",
    component: <TopologyPageLarge url="/canary/api" />
  },
  logs: {
    name: "Logs",
    path: `/logs`,
    useSidebarLayout: "true",
    component: <LogsPage />
  },
  traces: {
    name: "Traces",
    path: `/traces`,
    useSidebarLayout: "true",
    component: <TraceView />
  },
  metrics: {
    name: "Metrics",
    path: `/metrics`,
    useSidebarLayout: "true",
    component: <Placeholder text="metrics" />
  },
  canary: {
    name: "Canary",
    path: `/health`,
    useSidebarLayout: "true",
    component: <CanaryPage url="/canary/api" />
  },
  heirarchyTest: {
    name: "HeirarchyTestPage",
    path: `/heirarchyTest`,
    useSidebarLayout: "true",
    component: <HeirarchyTestPageOld />
  },
  incidentList: {
    name: "Incident List",
    path: `/incidents`,
    useSidebarLayout: "true",
    component: <IncidentListPage />
  },
  incidentDetails: {
    name: "Incident Details",
    path: `/incidents/:id`,
    useSidebarLayout: "true",
    component: <IncidentDetailsPage />
  }
};

export const routeList = Object.keys(routes);
