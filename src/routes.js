import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { JsonFormPage } from "./pages/Examples/jsonForm";

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
  jsonForm: {
    name: "JsonForm",
    exact: true,
    path: `/jsonForm`,
    component: <JsonFormPage />
  }
};

export const routeList = Object.keys(routes);
