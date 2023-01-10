import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import objectHash from "object-hash";
import ConfigList from "../../components/ConfigList";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { ConfigLayout } from "../../components/Layout";
import { Tags } from "../../components/Tags";

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
      sortOrder
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
    console.log(
      "allConfigs",
      allConfigs,
      new Set(
        allConfigs.data?.filter((c) => c.name.includes("alertmanager-main-0"))
      )
    );
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
    <ConfigLayout basePath="configs" title="Configs" isLoading={loading}>
      <div className="flex flex-col h-full overflow-y-hidden">
        <ConfigList
          data={data!}
          handleRowClick={handleRowClick}
          isLoading={loading}
        />
      </div>
    </ConfigLayout>
  );
}
