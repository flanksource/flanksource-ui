import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageCompact } from "./pages/Examples/TopologyPageSmall/TopologyPageCompact";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { TopologyPageFull } from "./pages/Examples/TopologyPageFull/TopologyPageFull";

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
    path: `/topology-small`,
    component: <TopologyPageCompact />
  },
  topologyMedium: {
    name: "TopologyMedium",
    exact: true,
    path: `/topology-medium`,
    component: <TopologyPageMedium />
  },
  topologyLarge: {
    name: "TopologyLarge",
    exact: true,
    path: `/topology-large`,
    component: <TopologyPageFull />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/`,
    component: <CanaryPage />
  }
};

export const routeList = Object.keys(routes);
