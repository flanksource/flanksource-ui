import { useAllConfigsQuery } from "@flanksource-ui/api/query-hooks/useAllConfigsQuery";
import { useConfigSummaryQuery } from "@flanksource-ui/api/query-hooks/useConfigSummaryQuery";
import ConfigsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsTable";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigSummaryList from "@flanksource-ui/components/Configs/ConfigSummary/ConfigSummaryList";
import useGroupBySearchParam from "@flanksource-ui/components/Configs/ConfigSummary/utils/useGroupBySearchParam";
import ConfigsListFilters from "@flanksource-ui/components/Configs/ConfigsListFilters";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { SearchLayout } from "@flanksource-ui/components/Layout/SearchLayout";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function ConfigListPage() {
  const [searchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "type"
  });

  const configType = searchParams.get("configType") ?? undefined;
  const labels = searchParams.get("labels") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const groupBy = useGroupBySearchParam();

  // Show summary if no search, tag or configType is provided
  const showConfigSummaryList = useMemo(
    () => !configType && !labels && !search,
    [configType, labels, search]
  );

  const {
    data: allConfigs,
    isLoading: isLoadingConfigList,
    refetch: refetchConfigList,
    isRefetching
  } = useAllConfigsQuery({
    cacheTime: 0,
    enabled: !showConfigSummaryList
  });

  const {
    isLoading: isLoadingSummary,
    data: configSummary = [],
    refetch: refetchSummary
  } = useConfigSummaryQuery({
    enabled: showConfigSummaryList
  });

  const isLoading = isLoadingConfigList || isLoadingSummary || isRefetching;

  const refetch = showConfigSummaryList ? refetchSummary : refetchConfigList;

  return (
    <>
      <Head prefix={`Catalog`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/catalog" key={"/catalog"}>
                Catalog
              </BreadcrumbRoot>,
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
        onRefresh={() => refetch()}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <ConfigPageTabs activeTab="Catalog">
          <div className="flex flex-row items-center">
            <ConfigsListFilters />
          </div>

          <div className="flex flex-col h-full overflow-y-hidden">
            {showConfigSummaryList ? (
              <ConfigSummaryList
                isLoading={isLoadingSummary}
                data={configSummary}
                groupBy={groupBy ?? ["type"]}
              />
            ) : (
              <ConfigsTable
                data={allConfigs?.data ?? []}
                isLoading={isLoading}
                groupBy={groupBy?.[0] === "type" ? undefined : groupBy?.[0]}
              />
            )}
          </div>
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
