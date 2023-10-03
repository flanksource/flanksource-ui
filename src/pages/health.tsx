import { useState } from "react";
import { BreadcrumbNav, BreadcrumbRoot } from "../components/BreadcrumbNav";
import { Canary } from "../components/Canary";
import { Head } from "../components/Head/Head";
import { SearchLayout } from "../components/Layout";
import RefreshDropdown, {
  HEALTH_PAGE_REFRESH_RATE_KEY
} from "../components/RefreshDropdown";
import { HealthRefreshDropdownRateContext } from "../components/RefreshDropdown/RefreshRateContext";
import AddSchemaResourceModal from "../components/SchemaResourcePage/AddSchemaResourceModal";
import { schemaResourceTypes } from "../components/SchemaResourcePage/resourceTypes";

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
                <BreadcrumbRoot link="/health">Health</BreadcrumbRoot>,
                <AddSchemaResourceModal
                  onClose={() => setTriggerRefresh(triggerRefresh + 1)}
                  resourceInfo={resourceInfo!}
                />
              ]}
            />
          }
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
    </>
  );
}
