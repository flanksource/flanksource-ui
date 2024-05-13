import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import ConfigInsightsList from "@flanksource-ui/components/Configs/Insights/ConfigInsightsList";
import { ConfigInsightsFilters } from "@flanksource-ui/components/Configs/Insights/Filters/ConfigInsightsFilters";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar";
import { useAtom } from "jotai";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigInsightsPage() {
  const [params] = useSearchParams();
  const configType = params.get("configType") ?? undefined;

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
              <BreadcrumbRoot link="/catalog" key="root-catalog-insights">
                Catalog
              </BreadcrumbRoot>,
              <BreadcrumbChild link="/catalog/insights" key="insights">
                Insights
              </BreadcrumbChild>,
              ...(configType
                ? [
                    <BreadcrumbChild
                      link={`/catalog?configType=${configType}`}
                      key={configType}
                    >
                      <ConfigsTypeIcon
                        config={{ type: configType }}
                        showSecondaryIcon
                        showLabel
                      />
                    </BreadcrumbChild>
                  ]
                : [])
            ]}
          />
        }
        onRefresh={() => setRefreshButtonClickedTrigger((prev) => prev + 1)}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Insights">
          <div className="flex flex-row items-center">
            <ConfigInsightsFilters paramsToReset={["pageIndex", "pageSize"]} />
          </div>
          <div className="flex flex-col h-full overflow-y-hidden">
            <ConfigInsightsList
              setIsLoading={(isLoading) => setIsLoading(isLoading)}
              triggerRefresh={triggerRefresh}
            />
          </div>
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
