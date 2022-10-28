import { SearchIcon } from "@heroicons/react/solid";
import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { CSSProperties, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoader } from "../hooks";
import { getLogs } from "../api/services/logs";
import { getTopology, getTopologyComponents } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { LogsViewer } from "../components/Logs";
import { TextInput } from "../components/TextInput";
import { timeRanges } from "../components/Dropdown/TimeRange";
import { Icon } from "../components";
import { SearchableDropdown } from "../components/SearchableDropdown";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import { useComponentsQuery } from "../api/query-hooks";

export const logTypes = [
  {
    icon: <BsGridFill />,
    description: "Node",
    value: "KubernetesNode"
  },
  {
    icon: <BsGearFill />,
    description: "Service",
    value: "KubernetesService"
  },
  {
    icon: <BsFlower2 />,
    description: "Pod",
    value: "KubernetesPod"
  },
  {
    icon: <BsStack />,
    description: "VM",
    value: "VM"
  }
];

const optionStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "10px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
};

const formatOptionLabel = (data: { label: string; icon: any }) => (
  <div style={optionStyles} title={data.label}>
    <span>
      <Icon className="inline" name={data.icon} size="xl" /> {data.label}
    </span>
  </div>
);
export function LogsPage() {
  const { loading, loaded, setLoading } = useLoader();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const [topologyId, setTopologyId] = useState(searchParams.get("topologyId"));
  const [externalId, setExternalId] = useState();
  const [topology, setTopology] = useState<Record<string, any>>();
  const [type, setType] = useState();
  const [start, setStart] = useState(
    searchParams.get("start") || timeRanges[0].value
  );
  const { data: components } = useComponentsQuery({});

  const [topologies, setTopologies] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!topologyId) {
      return;
    }
    getTopology({
      id: topologyId
    }).then(({ data }) => {
      const result = data[0];
      if ((topology as any)?.id === topologyId) {
        return;
      }
      setTopology(result);
      setType(result.type);
      setExternalId(result.external_id);
    });
  }, [topologyId]);

  useEffect(() => {
    if (!components?.data) {
      return;
    }
    const data = components.data
      .filter((item) => {
        item.label = item.name;
        item.value = item.id;
        return item.external_id;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    setTopologies(data);
  }, [components]);

  const saveQueryParams = () => {
    const paramsList = { query, topologyId, externalId, start, type };
    const params: Record<string, any> = {};
    Object.entries(paramsList).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
    setSearchParams(params);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadLogs = () => {
    saveQueryParams();
    setLoading(true);

    const queryBody = {
      query,
      id: externalId,
      type,
      start
    };
    getLogs(queryBody)
      .then((res) => {
        setLogs(res?.data?.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const onComponentSelect = (component: any) => {
    setTopology(component);
    setTopologyId(component?.id);
    setExternalId(component?.external_id);
    setType(component?.type);
  };

  useEffect(() => {
    if (!externalId) {
      return;
    }
    loadLogs();
  }, [start, externalId, type]);

  return (
    <SearchLayout
      onRefresh={() => loadLogs()}
      title={
        <h1 className="text-xl font-semibold">
          Logs{topology ? `/${topology.name}` : ""}
        </h1>
      }
      contentClass={`h-full py-4 px-6 ${
        loaded || (Boolean(logs.length) ? "p-6" : "")
      }`}
      extra={
        <ReactSelectDropdown
          name="start"
          className="w-44 mr-2"
          items={timeRanges}
          onChange={(e) => {
            if (e) {
              setStart(e);
            }
          }}
          value={start}
        />
      }
    >
      <div className="flex flex-col space-y-6 h-full">
        <div className="flex flex-row w-full">
          {/* @ts-expect-error */}
          <SearchableDropdown
            className="w-96"
            value={topology}
            isLoading={loading}
            options={topologies}
            isDisabled={loading}
            placeholder="Select component"
            onChange={onComponentSelect}
            formatOptionLabel={formatOptionLabel}
          />

          <div className="mx-2 w-80 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button
                type="button"
                onClick={() => loadLogs()}
                className="hover"
              >
                <SearchIcon
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  aria-hidden="true"
                />
              </button>
            </div>
            <TextInput
              placeholder="Search"
              className="pl-10 pb-2.5 w-full flex-shrink-0"
              style={{ height: "38px" }}
              id="searchQuery"
              onEnter={() => loadLogs()}
              onChange={(e) => {
                e.preventDefault();
                setQuery(e.target.value);
              }}
              value={query ?? undefined}
            />
          </div>
        </div>
        {loading
          ? !logs.length && <Loading className="mt-40" text="Loading logs..." />
          : !loaded && (
              <div className="flex flex-col justify-center items-center h-5/6">
                <h3 className="text-center font-semibold text-lg">
                  Please select a component to view the logs.
                </h3>
              </div>
            )}
        {(loaded || Boolean(logs.length)) && (
          // @ts-expect-error
          <LogsViewer className="pt-4" logs={logs} />
        )}
      </div>
    </SearchLayout>
  );
}
