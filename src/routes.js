import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { HeirarchyTestPage } from "./pages/Examples/heirarchyTest";

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
    component: <HeirarchyTestPage />
  }
};

export const routeList = Object.keys(routes);
