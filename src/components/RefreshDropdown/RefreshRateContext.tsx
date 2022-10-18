import { createContext } from "react";

const refreshRateContextValue = {
  refreshRate: "None",
  setRefreshRate: (value: string) => {}
};

export const HealthRefreshDropdownRateContext = createContext(
  refreshRateContextValue
);
