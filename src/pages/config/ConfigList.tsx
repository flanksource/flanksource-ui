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

  const {
    data: allConfigs,
    isLoading,
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
    setTitle(<BreadcrumbNav list={["Config"]} />);
  }, [data]);

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
