import { useCallback, useEffect, useMemo } from "react";
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
import ConfigsListFilters from "../../components/ConfigsListFilters";

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
  const groupType = decodeURIComponent(params.get("groupBy") || "config_type");

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
    <div className="flex flex-col h-full space-y-6 px-4 py-4">
      <div className="flex flex-row items-center">
        <ConfigsListFilters />
      </div>
      <ConfigList
        data={filteredData!}
        handleRowClick={handleRowClick}
        isLoading={loading}
      />
    </div>
  );
}

const TypeDropdown = ({ ...rest }) => {
  const items = {
    All: {
      id: "All",
      name: "All",
      description: "All",
      value: "All"
    },
    EC2Instance: {
      id: "EC2Instance",
      name: "EC2 Instance",
      description: "EC2 Instance",
      value: "EC2Instance"
    },
    Subnet: {
      id: "Subnet",
      name: "Subnet",
      description: "Subnet",
      value: "Subnet"
    }
  };

  const [selected, setSelected] = useState<any>(Object.values(items)[0].value);

  return (
    <ReactSelectDropdown
      items={items}
      name="type"
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-64"
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
      {...rest}
    />
  );
};

const GroupDropdown = ({ ...rest }) => {
  const items = {
    NoGrouping: {
      id: "No Grouping",
      name: "No Grouping",
      description: "No Grouping",
      value: "no_grouping"
    },
    Type: {
      id: "Type",
      name: "Type",
      description: "Type",
      value: "config_type"
    },
    Name: {
      id: "Name",
      name: "Name",
      description: "Name",
      value: "name"
    },
    Analysis: {
      id: "Analysis",
      name: "Analysis",
      description: "Analysis",
      value: "analysis"
    },
    Changed: {
      id: "Changed",
      name: "Changed",
      description: "Changed",
      value: "changed"
    }
  };

  const [selected, setSelected] = useState(Object.values(items)[0].value);

  return (
    <ReactSelectDropdown
      items={items}
      onChange={(value) => setSelected(value)}
      value={selected}
      className="w-64"
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
      {...rest}
    />
  );
};
