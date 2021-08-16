
import Examples from "./pages/Examples";
import CanaryPage from "./pages/Examples/canary";


export const routes = {
  examples: {
    name: "Examples",
    exact: true,
    path: `/`,
    component: <Examples />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/canary`,
    component: <CanaryPage />
  }
};

export const routeList = Object.keys(routes);
