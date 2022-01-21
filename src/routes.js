import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageSmall } from "./pages/Examples/TopologyPageSmall/TopologyPageSmall";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { TopologyPageLarge } from "./pages/Examples/TopologyPageLarge/TopologyPageLarge";

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
    component: <TopologyPageSmall />
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
    component: <TopologyPageLarge />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/`,
    component: <CanaryPage />
  }
};

export const routeList = Object.keys(routes);
