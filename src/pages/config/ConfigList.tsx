import { useEffect, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext
} from "react-router-dom";
import { filterConfigsByText } from "../../components/ConfigViewer/utils";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";
import ConfigList from "../../components/ConfigList";
import { RefreshButton } from "../../components/RefreshButton";
import { useConfigPageContext } from "../../context/ConfigPageContext";
import { useAllConfigsQuery } from "../../api/query-hooks";
import { getAllConfigs } from "../../api/services/configs";

export function ConfigListPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    configState: { data, filteredData },
    setConfigState
  } = useConfigPageContext();
  const { setTitle, setTitleExtras } = useOutletContext<any>();

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

  useEffect(() => {
    if (params.get("query")) {
      return;
    }
    if (!allConfigs?.data) {
      return;
    }
    setConfigState((state) => {
      return {
        ...state,
        data: allConfigs.data
      };
    });
  }, [params, allConfigs]);

  const loading = useMemo(() => {
    return isLoading || isRefetching;
  }, [isLoading, isRefetching]);

  const handleRowClick = (row?: { original?: { id: string } }) => {
    const id = row?.original?.id;
    if (id) {
      navigate(`/configs/${id}`);
    }
  };

  useEffect(() => {
    setTitleExtras(
      <RefreshButton onClick={() => getAllConfigs()} animate={isLoading} />
    );
  }, [loading, setTitleExtras]);

  useEffect(() => {
    let filteredData = data;
    setTitle(<BreadcrumbNav list={["Config"]} />);
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
  }, [data, search, configType, tag]);

  return (
    <div className="flex flex-col h-full space-y-6 px-4 pt-4 overflow-y-hidden">
      <ConfigList
        data={filteredData!}
        handleRowClick={handleRowClick}
        isLoading={loading}
      />
    </div>
  );
}
