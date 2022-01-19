import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { HeirarchyTestPageOld } from "./pages/Examples/heirarchyTestOld";
import { IncidentDetailsPage } from "./pages/TopologyViewer/Incident/IncidentDetails";
import { IncidentListPage } from "./pages/TopologyViewer/Incident/IncidentList";

export const routes = {
  examples: {
    name: "Examples",
    exact: true,
    path: `/examples`,
    component: <Examples />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/`,
    component: <CanaryPage />
  },
  heirarchyTest: {
    name: "HeirarchyTestPage",
    exact: true,
    path: `/heirarchyTest`,
    component: <HeirarchyTestPageOld />
  },
  incidentList: {
    name: "Incident List",
    exact: true,
    path: `/incident`,
    component: <IncidentListPage />
  },
  incidentDetails: {
    name: "Incident Details",
    exact: true,
    path: `/incident/:id`,
    component: <IncidentDetailsPage />
  }
};

export const routeList = Object.keys(routes);
