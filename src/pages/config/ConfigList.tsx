import { useEffect, useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext
} from "react-router-dom";
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
    configState: { data },
    setConfigState
  } = useConfigPageContext();
  const { setTitle, setTitleExtras } = useOutletContext<any>();
  const search = params.get("search");
  const tag = decodeURIComponent(params.get("tag") || "All");
  const configType = decodeURIComponent(params.get("type") || "All");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");

  const query = useMemo(() => {
    return prepareConfigListQuery();
  }, [search, tag, configType, sortBy, sortOrder]);

  const {
    data: allConfigs,
    isLoading,
    isRefetching
  } = useAllConfigsQuery(query, {
    cacheTime: 0
  });

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

  function prepareConfigListQuery() {
    let query = "select=*";
    if (search) {
      query = `&${query}or=(name.ilike.*${search}*,config_type.ilike.*${search}*,description.ilike.*${search}*,namespace.ilike.*${search}*)`;
    } else {
      const filterQueries = [];
      if (configType && configType !== "All") {
        filterQueries.push(`config_type.eq.${configType}`);
      }
      if (tag && tag !== "All") {
        const [k, v] = decodeURI(tag).split("__:__");
        filterQueries.push(`tags->>${k}=eq.${encodeURIComponent(v)}`);
      }
      if (filterQueries.length) {
        query = `${query}&${filterQueries.join("&")}`;
      }
    }
    if (sortBy && sortOrder) {
      const sortField = sortBy === "config_type" ? `${sortBy},name` : sortBy;
      query = `${query}&order=${sortField}.${sortOrder}`;
    }
    return query;
  }

  useEffect(() => {
    setTitleExtras(
      <RefreshButton onClick={() => getAllConfigs()} animate={isLoading} />
    );
  }, [loading, setTitleExtras]);

  useEffect(() => {
    setTitle(<BreadcrumbNav list={["Config"]} />);
  }, [data, search, configType, tag]);

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      <ConfigList
        data={data!}
        handleRowClick={handleRowClick}
        isLoading={loading}
      />
    </div>
  );
}
