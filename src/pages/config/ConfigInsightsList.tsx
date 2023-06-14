import { useState } from "react";
import { ConfigInsightsFilters } from "../../components/ConfigAnalysis/Filters/ConfigInsightsFilters";
import ConfigInsightsList from "../../components/ConfigAnalysis/ConfigInsightsList";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useAtom } from "jotai";
import { refreshButtonClickedTrigger } from "../../components/SlidingSideBar";

export function ConfigInsightsPage() {
  const [triggerRefresh, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Head prefix="Config Insights" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/configs/insights">
                Config Insights
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={() => setRefreshButtonClickedTrigger((prev) => prev + 1)}
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
    </>
  );
}
