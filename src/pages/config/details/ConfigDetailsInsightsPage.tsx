import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import ConfigInsightsList from "@flanksource-ui/components/Configs/Insights/ConfigInsightsList";
import { ConfigInsightsFilters } from "@flanksource-ui/components/Configs/Insights/Filters/ConfigInsightsFilters";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useAtom } from "jotai";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function ConfigDetailsInsightsPage() {
  const { id } = useParams();

  const [triggerRefresh, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const [isLoading, setIsLoading] = useState(true);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Insights"}
      isLoading={isLoading}
      refetch={() => setRefreshButtonClickedTrigger((x) => x++)}
      activeTabName="Insights"
    >
      <div className={`flex h-full flex-1 flex-col space-y-2`}>
        <div className="flex flex-row items-center">
          <ConfigInsightsFilters />
        </div>
        <div className="flex h-full flex-col overflow-y-hidden">
          <ConfigInsightsList
            setIsLoading={(isLoading) => setIsLoading(isLoading)}
            triggerRefresh={triggerRefresh}
            configId={id}
            columnsToHide={["catalog"]}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
