import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import objectHash from "object-hash";
import ConfigList from "../../components/ConfigList";
import {
  useAllConfigsQuery,
  useConfigSummaryQuery
} from "../../api/query-hooks";
import { SearchLayout } from "../../components/Layout";
import ConfigsListFilters from "../../components/ConfigsListFilters";
import { Head } from "../../components/Head/Head";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useAtom } from "jotai";
import { areDeletedConfigsHidden } from "../../components/ConfigListToggledDeletedItems/ConfigListToggledDeletedItems";
import ConfigsTypeIcon from "../../components/Configs/ConfigsTypeIcon";
import ConfigSummaryList from "../../components/ConfigSummary/ConfigSummaryList";

export function ConfigListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const search = params.get("search");
  const tag = decodeURIComponent(params.get("tag") || "");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  const hideDeleted = params.get("hideDeleted");
  const [deletedConfigsHidden, setDeletedConfigsHidden] = useAtom(
    areDeletedConfigsHidden
  );
  const hideDeletedConfigs = deletedConfigsHidden === "yes";
  const configType = params.get("type") ?? undefined;

  // Show summary if no search, tag or configType is provided
  const showConfigSummaryList = useMemo(
    () => !configType && !search && !tag,
    [configType, search, tag]
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

  useEffect(() => {
    if (hideDeleted) {
      setDeletedConfigsHidden(hideDeleted);
    }
  }, [hideDeleted, setDeletedConfigsHidden]);

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
    if (params.get("query")) {
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
  }, [params, allConfigs, groupByProp]);

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
              <BreadcrumbRoot link="/catalog">Catalog</BreadcrumbRoot>,
              ...(configType
                ? [
                    <BreadcrumbRoot link={`/catalog/${configType}`}>
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
