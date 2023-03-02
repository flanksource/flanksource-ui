import { useState } from "react";
import { ConfigInsightsFilters } from "../../components/ConfigAnalysis/ConfigInsightsFilters";
import ConfigInsightsList from "../../components/ConfigAnalysis/ConfigInsightsList";
import { ConfigsPageTabs } from "../../components/ConfigsPage/ConfigsPageTabs";
import { SearchLayout } from "../../components/Layout";

export function ConfigInsightsPage() {
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SearchLayout
      title={
        <div className="flex space-x-2">
          <span className="text-lg">Config Insights</span>
        </div>
      }
      onRefresh={() => setTriggerRefresh(triggerRefresh + 1)}
      loading={isLoading}
      contentClass="p-0 h-full"
    >
      <div className={`flex flex-col p-6 pb-0 h-full flex-1 overflow-auto`}>
        <ConfigInsightsFilters />
        <ConfigsPageTabs basePath={"configs"} />
        <ConfigInsightsList
          setIsLoading={(isLoading) => setIsLoading(isLoading)}
          triggerRefresh={triggerRefresh}
        />
      </div>
    </SearchLayout>
  );
}
