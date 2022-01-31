import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageSmall } from "./pages/Examples/TopologyPageSmall/TopologyPageSmall";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { TopologyPageLarge } from "./pages/Examples/TopologyPageLarge/TopologyPageLarge";
import { HeirarchyTestPageOld } from "./pages/Examples/heirarchyTestOld";
import { IncidentDetailsPage } from "./pages/TopologyViewer/Incident/IncidentDetails";
import { IncidentListPage } from "./pages/TopologyViewer/Incident/IncidentList";
import { TopologyViewer } from "./components/Topology/viewer";
import { TraceView } from "./components/Traces";
import { LogsPage } from "./pages/Logs";
import { Placeholder } from "./pages/Examples/Placeholder";

export const routes = {
  examples: {
    name: "Examples",
    path: `/examples`,
    component: <Examples />
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
