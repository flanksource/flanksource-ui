import { useState } from "react";
import { SearchLayout } from "../components/Layout";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { Canary } from "../components/Canary";
import RefreshDropdown, {
  HEALTH_PAGE_REFRESH_RATE_KEY
} from "../components/RefreshDropdown";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";

type Props = {
  url: string;
};

export function HealthPage({ url }: Props) {
  const [loading, setLoading] = useState(true);
  /**
   * Refresh page whenever clicked, increment state to trigger useEffect
   */
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshRate, setRefreshRate] = useState(() => {
    const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
    return refreshRate ?? "";
  });

  return (
    <HealthRefreshDropdownRateContext.Provider
      value={{
        refreshRate,
        setRefreshRate
      }}
    >
      <SearchLayout
        title={<h1 className="text-xl font-semibold">Health</h1>}
        extra={
          <RefreshDropdown
            onClick={() => setTriggerRefresh(triggerRefresh + 1)}
            isLoading={loading}
          />
        }
        contentClass="p-0"
      >
        <Canary
          url={url}
          onLoading={setLoading}
          triggerRefresh={triggerRefresh}
        />
      </SearchLayout>
    </HealthRefreshDropdownRateContext.Provider>
  );
}
