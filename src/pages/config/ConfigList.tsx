import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import objectHash from "object-hash";
import ConfigList from "../../components/ConfigList";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { SearchLayout } from "../../components/Layout";
import ConfigsListFilters from "../../components/ConfigsListFilters";
import { Head } from "../../components/Head/Head";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { configTabsLists } from "../../components/ConfigsPage/ConfigTabsLinks";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";

export function ConfigListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    configState: { data },
    setConfigState
  } = useConfigPageContext();

  const search = params.get("search");
  const tag = decodeURIComponent(params.get("tag") || "All");
  const configType = decodeURIComponent(params.get("type") || "All");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");
  const hideDeletedConfigs = params.get("hideDeleted") === "yes";

  const {
    data: allConfigs,
    isLoading,
    refetch,
    isRefetching
  } = useAllConfigsQuery(
    {
      search,
      tag,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs
    },
    {
      cacheTime: 0
    }
  );

  useEffect(() => {
    if (params.get("query")) {
      return;
    }
    if (!allConfigs?.data) {
      return;
    }
    allConfigs.data.forEach((item) => {
      item.tags = item.tags || {};
      item.allTags = { ...item.tags };
      item.tags.toString = () => {
        return objectHash(item.tags?.[groupByProp] || {});
      };
    });
    setConfigState((state) => {
      return {
        ...state,
        data: allConfigs.data
      };
    });
  }, [params, allConfigs, setConfigState, groupByProp]);

  const loading = isLoading || isRefetching;

  const handleRowClick = (row?: { original?: { id: string } }) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/configs/${id}`);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configType, tag, sortOrder, search, sortBy]);

  return (
    <>
      <Head prefix="Configs" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[<BreadcrumbRoot link="/configs">Configs</BreadcrumbRoot>]}
          />
        }
        onRefresh={() => refetch()}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-row h-full`}>
          <TabbedLinks tabLinks={configTabsLists}>
            <div className={`flex flex-col flex-1 h-full space-y-4`}>
              <div className="flex flex-row items-center">
                <ConfigsListFilters />
              </div>

              <div className="flex flex-col h-full overflow-y-hidden">
                <ConfigList
                  data={data!}
                  handleRowClick={handleRowClick}
                  isLoading={loading}
                />
              </div>
            </div>
          </TabbedLinks>
        </div>
      </SearchLayout>
    </>
  );
}
