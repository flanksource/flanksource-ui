import { useState } from "react";
import { ConfigInsightsFilters } from "../../components/ConfigAnalysis/ConfigInsightsFilters";
import ConfigInsightsList from "../../components/ConfigAnalysis/ConfigInsightsList";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { SearchLayout } from "../../components/Layout";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

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
      <div className={`flex flex-col h-full`}>
        <TabbedLinks tabLinks={configTabsLists}>
          <div className={`flex flex-col flex-1 h-full space-y-2`}>
            <div className="flex flex-row items-center">
              <ConfigInsightsFilters />
            </div>
            <div className="flex flex-col h-full overflow-y-hidden">
              <ConfigInsightsList
                setIsLoading={(isLoading) => setIsLoading(isLoading)}
                triggerRefresh={triggerRefresh}
              />
            </div>
          </div>
        </TabbedLinks>
      </div>
    </SearchLayout>
  );
}
