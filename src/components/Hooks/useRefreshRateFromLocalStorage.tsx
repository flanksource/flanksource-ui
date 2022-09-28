import { useEffect, useState } from "react";
import {
  HEALTH_PAGE_REFRESH_RATE_KEY,
  HEALTH_PAGE_REFRESH_RATE_STORAGE_CHANGE_EVENT
} from "../RefreshDropdown";

export default function useRefreshRateFromLocalStorage() {
  const calculateRefreshRateInMilliseconds = (refreshRate: string) => {
    console.log("refresh rate", refreshRate);
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
    const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
    return calculateRefreshRateInMilliseconds(refreshRate ?? "None");
  });

  useEffect(() => {
    window.addEventListener(
      HEALTH_PAGE_REFRESH_RATE_STORAGE_CHANGE_EVENT,
      (e) => {
        const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
        const refreshRateInMS = calculateRefreshRateInMilliseconds(
          refreshRate ?? "None"
        );
        setRefreshInterval(refreshRateInMS);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return refreshInterval;
}
