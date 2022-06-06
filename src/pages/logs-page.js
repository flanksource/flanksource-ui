import { SearchIcon } from "@heroicons/react/solid";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoader } from "../hooks";
import { getLogs } from "../api/services/logs";
import { getTopology } from "../api/services/topology";
import { Dropdown } from "../components/Dropdown";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { LogsViewer } from "../components/Logs";
import { TextInput } from "../components/TextInput";
import { timeRanges } from "../components/Dropdown/TimeRange";
import { RefreshButton } from "../components/RefreshButton";
import { Icon } from "../components";
import { SearchableDropdown } from "../components/SearchableDropdown";

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

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center"
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>
      <Icon className="inline" name={data.icon} size="xl" /> {data.label}
    </span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export function LogsPage() {
  const { idle, loading, loaded, setLoading } = useLoader();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const [topologyId, setTopologyId] = useState(searchParams.get("topologyId"));
  const [externalId, setExternalId] = useState(searchParams.get("externalId"));
  const [type, setType] = useState(searchParams.get("type"));
  const [start, setStart] = useState(
    searchParams.get("start") || timeRanges[0].value
  );

  const [topology, setTopology] = useState();
  const [topologies, setTopologies] = useState([]);
  const [logs, setLogs] = useState([]);

  const { control, getValues, watch } = useForm({
    defaultValues: {
      start: searchParams.get("start") || timeRanges[0].value,
      topologyId
    }
  });

  useEffect(() => {
    if (topologyId === null) {
      return;
    }
    getTopology({ id: topologyId }).then((topology) => {
      const result = topology.data[0];
      if (
        isEmpty(result.id) &&
        result.components != null &&
        result.components.length === 1
      ) {
        setTopology(result.components[0]);
      } else {
        setTopology(result);
      }
    });
  }, [topologyId]);

  useEffect(() => {
    if (topologyId) {
      return;
    }
    async function fetchTopologies() {
      try {
        const result = await getTopology({});
        const groups = [];
        result.data.map((topology) => {
          const group = {
            label: topology.name,
            icon: topology.icon,
            options: []
          };
          topology.components.forEach((component) => {
            component.components.forEach((item) => {
              item.label = item.name;
              item.value = item.id;
              group.options.push(item);
            });
          });
          groups.push(group);
        });
        setTopologies(groups);
      } catch (ex) {}
    }
    fetchTopologies();
  }, [topologyId]);

  const saveQueryParams = () => {
    const paramsList = { query, topologyId, externalId, ...getValues() };
    const params = {};
    Object.entries(paramsList).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });
    setSearchParams(params);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadLogs = () => {
    if (!topologyId) {
      return;
    }

    saveQueryParams();
    setLoading(true);

    const queryBody = {
      query,
      externalId,
      type,
      start
    };
    getLogs(queryBody).then((res) => {
      setLogs(res?.data?.results || []);
      setLoading(false);
    });
  };

  const onComponentSelect = (component) => {
    setTopologyId(component.system_id);
    setExternalId(component.external_id);
    setType(component.type);
  };

  useEffect(() => {
    const subscription = watch((value) => {
      setTopologyId(value.topologyId);
      setStart(value.start);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    loadLogs();
  }, [start, topologyId, externalId]);

  return (
    <SearchLayout
      title={
        <div>
          <h1 className="text-xl font-semibold">
            Logs
            {topology && (
              <span className="text-gray-600">
                / {topology.name || topology.text}
              </span>
            )}
          </h1>
        </div>
      }
      extra={
        <>
          <RefreshButton onClick={() => loadLogs()} />
          <div className="mr-2 w-full relative rounded-md shadow-sm">
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
              value={query}
            />
          </div>
          <Dropdown
            control={control}
            name="start"
            className="w-40 mr-2 flex-shrink-0"
            items={timeRanges}
          />
        </>
      }
    >
      {idle && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg h-144">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Please select any pod or node for which you want to see the logs.
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <SearchableDropdown
                className="w-1/4"
                options={topologies}
                formatGroupLabel={formatGroupLabel}
                onChange={onComponentSelect}
              />
            </div>
          </div>
        </div>
      )}
      {loading && <Loading text="Loading logs..." />}
      {loaded && <LogsViewer logs={logs} />}
    </SearchLayout>
  );
}
