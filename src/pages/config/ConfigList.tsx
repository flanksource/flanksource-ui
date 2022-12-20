import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import objectHash from "object-hash";
import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import ConfigList from "../../components/ConfigList";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { ConfigLayout } from "../../components/Layout";

export function ConfigListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    configState: { data, filteredData },
    setConfigState
  } = useConfigPageContext();

  const {
    data: allConfigs,
    isLoading,
    isRefetching
  } = useAllConfigsQuery({
    cacheTime: 0
  });

  const search = params.get("search");
  const tag = decodeURIComponent(params.get("tag") || "All");
  const configType = decodeURIComponent(params.get("type") || "All");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

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
    let filteredData = data;
    if (data?.length! > 0) {
      // do filtering here
      filteredData = filterConfigsByText(filteredData, search);

      if (configType && configType !== "All") {
        filteredData = filteredData!.filter(
          (d) => configType === d.config_type
        );
      }

      if (tag && tag !== "All") {
        filteredData = filteredData
          ?.filter((d) => d.tags)!
          .filter((d) => {
            if (!d.tags) {
              return false;
            }
            if (Array.isArray(decodeURI(tag))) {
              const kvs = (decodeURI(tag) as unknown as string[]).map((x) =>
                x.split("__:__")
              );
              return kvs.some(([key, val]) => d.tags?.[key] === val);
            } else {
              const [k, v] = decodeURI(tag).split("__:__");
              return !!Object.entries(d.tags).find(
                ([key, value]) => value === v && key === k
              );
            }
          });
      }
    }
    setConfigState((state) => {
      return {
        ...state,
        filteredData: filteredData
      };
    });
  }, [data, search, configType, tag, setConfigState]);

  return (
    <ConfigLayout basePath="configs" title="Configs" isLoading={loading}>
      <div className="flex flex-col h-full overflow-y-hidden bg-white">
        <ConfigList
          data={filteredData!}
          handleRowClick={handleRowClick}
          isLoading={loading}
        />
      </div>
    </ConfigLayout>
  );
}
