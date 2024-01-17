import { useAtom } from "jotai";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigInsightsList from "@flanksource-ui/components/Configs/Insights/ConfigInsightsList";
import { ConfigInsightsFilters } from "@flanksource-ui/components/Configs/Insights/Filters/ConfigInsightsFilters";
import { refreshButtonClickedTrigger } from "@flanksource-ui/components/SlidingSideBar";

export function ConfigDetailsInsightsPage() {
  const { id } = useParams();

  const [triggerRefresh, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const [isLoading, setIsLoading] = useState(true);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Changes"}
      isLoading={isLoading}
      refetch={() => setRefreshButtonClickedTrigger((x) => x++)}
      activeTabName="Insights"
    >
      <div className={`flex flex-col flex-1 h-full space-y-2`}>
        <div className="flex flex-row items-center">
          <ConfigInsightsFilters />
        </div>
        <div className="flex flex-col h-full overflow-y-hidden">
          <ConfigInsightsList
            setIsLoading={(isLoading) => setIsLoading(isLoading)}
            triggerRefresh={triggerRefresh}
            configId={id}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
