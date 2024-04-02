import {
  useAllConfigsQuery,
  useConfigSummaryQuery
} from "@flanksource-ui/api/query-hooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import ConfigList from "@flanksource-ui/components/Configs/ConfigList";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigPageTabs from "@flanksource-ui/components/Configs/ConfigPageTabs";
import ConfigSummaryList from "@flanksource-ui/components/Configs/ConfigSummary/ConfigSummaryList";
import ConfigsListFilters from "@flanksource-ui/components/Configs/ConfigsListFilters";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import { useAtom } from "jotai";
import objectHash from "object-hash";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ConfigListPage() {
  const [searchParams, setSearchParams] = useSearchParams({
    sortBy: "type",
    sortOrder: "asc",
    groupBy: "no_grouping"
  });

  const navigate = useNavigate();

  const [deletedConfigsHidden] = useAtom(areDeletedConfigsHidden);

  const hideDeletedConfigs = deletedConfigsHidden === "yes";

  console.log(deletedConfigsHidden, hideDeletedConfigs);

  const search = searchParams.get("search") ?? undefined;
  const tag = searchParams.get("tag")
    ? decodeURIComponent(searchParams.get("tag")!)
    : undefined;
  const groupByProp = searchParams.get("groupByProp") ?? "";
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const configType = searchParams.get("configType") ?? undefined;
  // we want to get type and redirect to configType
  const type = searchParams.get("type") ?? undefined;

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
    () => !configType && !search && !groupByProp,
    [configType, groupByProp, search]
  );

  const {
    data: allConfigs,
    isLoading: isLoadingConfigList,
    refetch: isRefetchingConfigList,
    isRefetching
  } = useAllConfigsQuery(
    {
      search,
      tag,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs,
      includeAgents: true
    },
    {
      cacheTime: 0,
      enabled: !showConfigSummaryList
    }
  );

  const {
    isLoading: isLoadingSummary,
    data: configSummary = [],
    refetch: refetchSummary
  } = useConfigSummaryQuery({
    enabled: showConfigSummaryList
  });

  const isLoading = isLoadingConfigList || isLoadingSummary || isRefetching;

  const refetch = showConfigSummaryList
    ? refetchSummary
    : isRefetchingConfigList;

  const configList = useMemo(() => {
    if (searchParams.get("query")) {
      return [];
    }
    if (!allConfigs?.data) {
      return [];
    }
    return allConfigs.data.map((item) => {
      const tags = item.tags || {};
      tags.toString = () => {
        return objectHash(item.tags?.[groupByProp] || {});
      };
      return {
        ...item,
        tags,
        allTags: { ...item.tags }
      };
    });
  }, [searchParams, allConfigs, groupByProp]);

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
              />
            ) : (
              <ConfigList
                data={configList!}
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
