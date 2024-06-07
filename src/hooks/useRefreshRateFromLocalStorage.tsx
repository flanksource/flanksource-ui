import { useContext, useEffect, useState } from "react";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";

export default function useRefreshRateFromLocalStorage() {
  const { refreshRate } = useContext(HealthRefreshDropdownRateContext);

  const calculateRefreshRateInMilliseconds = (refreshRate: string) => {
    if (refreshRate.includes("s")) {
      return parseInt(refreshRate.replace("s", "")) * 1000;
    }
    if (refreshRate.includes("m")) {
      return parseInt(refreshRate.replace("m", "")) * 60 * 1000;
    }
    if (refreshRate.includes("h")) {
      return parseInt(refreshRate.replace("h", "")) * 60 * 60 * 1000;
    }
    if (refreshRate.includes("d")) {
      return parseInt(refreshRate.replace("d", "")) * 60 * 60 * 24 * 1000;
    }
    if (refreshRate.includes("w")) {
      return parseInt(refreshRate.replace("w", "")) * 60 * 60 * 24 * 7 * 1000;
    }
    // not a valid time range
    return 0;
  };

  const [refreshInterval, setRefreshInterval] = useState(() => {
    return calculateRefreshRateInMilliseconds(refreshRate ?? "None");
  });

  useEffect(() => {
    const refreshRateInMS = calculateRefreshRateInMilliseconds(
      refreshRate.toString() ?? "None"
    );
    setRefreshInterval(refreshRateInMS);
  }, [refreshRate]);

  return refreshInterval;
}
