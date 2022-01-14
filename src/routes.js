import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPage } from "./pages/Examples/TopologyPage/TopologyPage";

export const routes = {
  examples: {
    name: "Examples",
    exact: true,
    path: `/examples`,
    component: <Examples />
  },
  topology: {
    name: "Topology",
    exact: true,
    path: `/topology`,
    component: <TopologyPage />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/`,
    component: <CanaryPage />
  }
};

export const routeList = Object.keys(routes);
