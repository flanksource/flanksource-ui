import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { HeirarchyTestPageOld } from "./pages/Examples/heirarchyTestOld";
import { IncidentDetails } from "./pages/TopologyViewer/Incident/IncidentDetails";

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
  incidentDetails: {
    name: "Incident Details",
    exact: true,
    path: `/incident/:id`,
    component: <IncidentDetails />
  }
};

export const routeList = Object.keys(routes);
