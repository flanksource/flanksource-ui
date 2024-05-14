import {
  useAllConfigsQuery,
  useConfigSummaryQuery
} from "@flanksource-ui/api/query-hooks";
import ConfigsTable from "@flanksource-ui/components/Configs/ConfigList/ConfigsTable";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigSummaryList from "@flanksource-ui/components/Configs/ConfigSummary/ConfigSummaryList";
import ConfigsListFilters from "@flanksource-ui/components/Configs/ConfigsListFilters";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { tristateOutputToQueryParamValue } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ConfigListPage() {
  const [searchParams, setSearchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "type"
  });

  const navigate = useNavigate();

  const [deletedConfigsHidden] = useAtom(areDeletedConfigsHidden);
  const hideDeletedConfigs = deletedConfigsHidden === "yes";
  const search = searchParams.get("search") ?? undefined;
  const groupByProp = searchParams.get("groupBy") ?? undefined;
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const configType = searchParams.get("configType") ?? undefined;
  // we want to get type and redirect to configType
  const type = searchParams.get("type") ?? undefined;
  const labels = searchParams.get("labels") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const health = searchParams.get("health") ?? undefined;

  const labelList = useMemo(() => {
    if (labels) {
      return labels.split(",").map((label) => {
        const [key, value] = label.split("__:__");
        return `${key}:${value}`;
      });
    }
    return undefined;
  }, [labels]);

  // Redirect to configType if type is provided, we are doing this to support
  // old links that used type instead of configType and we are using configType
  // for consistency between different catalog pages and avoid collisions
  useEffect(() => {
    if (type) {
      searchParams.set("configType", type);
      searchParams.delete("type");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, type]);

  // Show summary if no search, tag or configType is provided
  const showConfigSummaryList = useMemo(
    () => !configType && !labels,
    [configType, labels]
  );

  const {
    data: allConfigs,
    isLoading: isLoadingConfigList,
    refetch: isRefetchingConfigList,
    isRefetching
  } = useAllConfigsQuery(
    {
      search,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs,
      includeAgents: true,
      tags: labelList,
      status,
      health
    },
    {
      cacheTime: 0,
      enabled: !showConfigSummaryList
    }
  );

  const groupBy = useMemo(() => {
    if (groupByProp) {
      return groupByProp.split(",").map((group) => group.replace("__tag", ""));
    }
    return undefined;
  }, [groupByProp]);

  const filterSummaryByLabel = useMemo(() => {
    if (labels) {
      return labels.split(",").reduce((acc, label) => {
        const [key, value] = label.split("__:__");
        return { ...acc, [key]: value };
      }, {});
    }
    return undefined;
  }, [labels]);

  const {
    isLoading: isLoadingSummary,
    data: configSummary = [],
    refetch: refetchSummary
  } = useConfigSummaryQuery(
    {
      groupBy,
      deleted: hideDeletedConfigs,
      filter: filterSummaryByLabel,
      health: health ? tristateOutputToQueryParamValue(health) : undefined,
      status: status ? tristateOutputToQueryParamValue(status) : undefined,
      changes: {
        since: "30d"
      },
      analysis: {
        since: "30d"
      },
      cost: "30d"
    },
    {}
  );

  const isLoading = isLoadingConfigList || isLoadingSummary || isRefetching;

  const refetch = showConfigSummaryList
    ? refetchSummary
    : isRefetchingConfigList;

  const handleRowClick = (row?: { original?: { id: string } }) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/catalog/${id}`);
    }
  };

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
                groupByTags={
                  groupByProp
                    ? groupByProp
                        .split(",")
                        .filter((group) => group.includes("__tag"))
                        .map((group) => group.replace("__tag", ""))
                    : []
                }
              />
            ) : (
              <ConfigsTable
                data={allConfigs?.data ?? []}
                handleRowClick={handleRowClick}
                isLoading={isLoading}
              />
            )}
          </div>
        </ConfigPageTabs>
      </SearchLayout>
    </>
  );
}
