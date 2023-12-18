import { useAtom } from "jotai";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import ConfigInsightsList from "../../components/Configs/ConfigAnalysis/ConfigInsightsList";
import { ConfigInsightsFilters } from "../../components/Configs/ConfigAnalysis/Filters/ConfigInsightsFilters";
import { useConfigDetailsTabs } from "../../components/Configs/ConfigsPage/ConfigTabsLinks";
import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import { refreshButtonClickedTrigger } from "../../components/SlidingSideBar";
import TabbedLinks from "../../components/Tabs/TabbedLinks";

export function ConfigDetailsInsightsPage() {
  const { id } = useParams();

  const { data: configItem } = useGetConfigByIdQuery(id!);

  const [triggerRefresh, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );
  const [isLoading, setIsLoading] = useState(true);

  const configTabs = useConfigDetailsTabs();

  return (
    <>
      <Head
        prefix={`Catalog Insights${
          configItem?.name ? ` - ${configItem?.name}` : ""
        }`}
      />
      <SearchLayout
        title={
          <div className="flex space-x-2">
            <span className="text-lg">
              <ConfigsDetailsBreadcrumbNav configId={id} />
            </span>
          </div>
        }
        onRefresh={() => setRefreshButtonClickedTrigger((prev) => prev + 1)}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-col h-full`}>
          <TabbedLinks tabLinks={configTabs} activeTabName="Insights">
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
          </TabbedLinks>
        </div>
      </SearchLayout>
    </>
  );
}
