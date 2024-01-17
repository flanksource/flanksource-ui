import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import { configTabsLists } from "@flanksource-ui/components/Configs/ConfigTabsLinks";
import ConfigInsightsList from "@flanksource-ui/components/Configs/Insights/ConfigInsightsList";
import { ConfigInsightsFilters } from "@flanksource-ui/components/Configs/Insights/Filters/ConfigInsightsFilters";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/components/SlidingSideBar";
import TabbedLinks from "@flanksource-ui/components/Tabs/TabbedLinks";
import { useAtom } from "jotai";
import { useState } from "react";

export function ConfigInsightsPage() {
  const [triggerRefresh, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Head prefix="Catalog Insights" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                link="/catalog/insights"
                key="root-catalog-insights"
              >
                Catalog Insights
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
