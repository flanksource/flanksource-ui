import {
  useAllConfigsQuery,
  useConfigSummaryQuery
} from "@flanksource-ui/api/query-hooks";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/components/BreadcrumbNav";
import ConfigList from "@flanksource-ui/components/Configs/ConfigList";
import { areDeletedConfigsHidden } from "@flanksource-ui/components/Configs/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigSummaryList from "@flanksource-ui/components/Configs/ConfigSummary/ConfigSummaryList";
import { configTabsLists } from "@flanksource-ui/components/Configs/ConfigTabsLinks";
import ConfigsListFilters from "@flanksource-ui/components/Configs/ConfigsListFilters";
import ConfigsTypeIcon from "@flanksource-ui/components/Configs/ConfigsTypeIcon";
import { Head } from "@flanksource-ui/components/Head/Head";
import { SearchLayout } from "@flanksource-ui/components/Layout";
import TabbedLinks from "@flanksource-ui/components/Tabs/TabbedLinks";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import objectHash from "object-hash";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export type ConfigPagesPathParams = {
  type?: string;
};

export function ConfigListPage() {
  const [searchParams] = useSearchParams();
  const { type: configType } = useParams<ConfigPagesPathParams>();
  const navigate = useNavigate();

  const search = searchParams.get("search");
  const tag = decodeURIComponent(searchParams.get("tag") || "");
  const groupByProp = decodeURIComponent(searchParams.get("groupByProp") ?? "");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const [deletedConfigsHidden] = useAtom(areDeletedConfigsHidden);
  const hideDeletedConfigs = deletedConfigsHidden === "yes";

  // Show summary if no search, tag or configType is provided
  const showConfigSummaryList = useMemo(
    () => !configType && !search && !tag && !groupByProp,
    [configType, groupByProp, search, tag]
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
  const refetch = refetchSummary || isRefetchingConfigList;

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
                    <BreadcrumbRoot
                      link={`/catalog?type=${configType}`}
                      key={configType}
                    >
                      <ConfigsTypeIcon
                        config={{ type: configType }}
                        showSecondaryIcon
                        showLabel
                      />
                    </BreadcrumbRoot>
                  ]
                : [])
            ]}
          />
        }
        onRefresh={() => refetch()}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-row h-full`}>
          <TabbedLinks tabLinks={configTabsLists} activeTabName="Catalog">
            <div className={`flex flex-col flex-1 h-full space-y-4`}>
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
            </div>
          </TabbedLinks>
        </div>
      </SearchLayout>
    </>
  );
}
