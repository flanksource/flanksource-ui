import { useAtom } from "jotai";
import { useState } from "react";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { configTabsLists } from "../../components/Configs/ConfigTabsLinks";
import ConfigInsightsList from "../../components/Configs/Insights/ConfigInsightsList";
import { ConfigInsightsFilters } from "../../components/Configs/Insights/Filters/ConfigInsightsFilters";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import { refreshButtonClickedTrigger } from "../../components/SlidingSideBar";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

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
