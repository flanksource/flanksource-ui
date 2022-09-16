import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useTimeRangeToDisableRefreshDropdownOptions() {
  const [refreshDropdownDisabledOptions, setRefreshDropdownDisabledOptions] =
    useState<("15s" | "30s" | "2m" | "3m")[]>([]);

  const { query } = useRouter();

  console.log("query", query);

  const timeRange = query.timeRange;

  const calculateTimeRangeRealValue = (timeRange: string) => {
    if (timeRange.includes("m")) {
      return parseInt(timeRange.replace("m", ""));
    }
    if (timeRange.includes("h")) {
      return parseInt(timeRange.replace("h", "")) * 60;
    }
    if (timeRange.includes("d")) {
      return parseInt(timeRange.replace("d", "")) * 60 * 24;
    }
    if (timeRange.includes("w")) {
      return parseInt(timeRange.replace("w", "")) * 60 * 24 * 7;
    }
    // not a valid time range
    return 0;
  };

  useEffect(() => {
    // ensure we are only working with a string, not array or undefined
    if (typeof timeRange === "string") {
      // timeRange is a string, in the format of 1h, 2h, 3h, 1d etc
      const timeRangeRealValue = calculateTimeRangeRealValue(timeRange);
      if (timeRangeRealValue >= 60) {
        setRefreshDropdownDisabledOptions((prev) => [...prev, "15s", "30s"]);
      }
      if (timeRangeRealValue >= 180) {
        setRefreshDropdownDisabledOptions((prev) => [...prev, "2m", "3m"]);
      }
    }
  }, [timeRange]);

  return refreshDropdownDisabledOptions;
}
