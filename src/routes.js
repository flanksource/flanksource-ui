import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";

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
  }
};

export const routeList = Object.keys(routes);
