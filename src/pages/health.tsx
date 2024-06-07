import CanaryStatsCards from "@flanksource-ui/components/Canary/CanaryStatsCard";
import { useHealthPageContext } from "@flanksource-ui/context/HealthPageContext";
import { useState } from "react";
import { Canary } from "../components/Canary";
import RefreshDropdown, {
  HEALTH_PAGE_REFRESH_RATE_KEY
} from "../components/RefreshDropdown";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";
import AddSchemaResourceModal from "../components/SchemaResourcePage/AddSchemaResourceModal";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";
import { BreadcrumbNav, BreadcrumbRoot } from "../ui/BreadcrumbNav";
import { Head } from "../ui/Head";
import { SearchLayout } from "../ui/Layout/SearchLayout";

type Props = {
  url: string;
};

export function HealthPage({ url }: Props) {
  const [loading, setLoading] = useState(true);

  const resourceInfo = schemaResourceTypes.find(
    (item) => item.name === "Health Check"
  );

  /**
   * Refresh page whenever clicked, increment state to trigger useEffect
   */
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [refreshRate, setRefreshRate] = useState(() => {
    const refreshRate = localStorage.getItem(HEALTH_PAGE_REFRESH_RATE_KEY);
    return refreshRate ?? "";
  });

  const {
    healthState: { passing, checks, filteredChecks }
  } = useHealthPageContext();

  return (
    <>
      <Head prefix="Health" />
      <HealthRefreshDropdownRateContext.Provider
        value={{
          refreshRate,
          setRefreshRate
        }}
      >
        <SearchLayout
          title={
            <BreadcrumbNav
              list={[
                <BreadcrumbRoot key={"health"} link="/health">
                  Health
                </BreadcrumbRoot>,
                <AddSchemaResourceModal
                  key={"add-form"}
                  onClose={() => setTriggerRefresh(triggerRefresh + 1)}
                  resourceInfo={resourceInfo!}
                />
              ]}
            />
          }
          extraClassName="w-full"
          extra={
            <div className="flex flex-row w-full items-center">
              <div className="flex-1 flex flex-row justify-center">
                <CanaryStatsCards
                  checks={checks ?? []}
                  passing={passing}
                  filteredChecks={filteredChecks}
                />
              </div>
              <RefreshDropdown
                onClick={() => setTriggerRefresh(triggerRefresh + 1)}
                isLoading={loading}
              />
            </div>
          }
          contentClass="flex flex-col h-full p-0"
        >
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-row flex-1 mx-auto w-full max-w-[100rem] overflow-y-auto">
              <Canary
                url={url}
                onLoading={setLoading}
                triggerRefresh={triggerRefresh}
              />
            </div>
          </div>
        </SearchLayout>
      </HealthRefreshDropdownRateContext.Provider>
    </>
  );
}
