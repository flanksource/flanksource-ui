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

export function LogsPage() {
  const [idle, loading, loaded, setLoading] = useLoader();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const [topologyId, setTopologyId] = useState(searchParams.get("topologyId"));
  const [externalId] = useState(searchParams.get("externalId"));
  const [start, setStart] = useState(
    searchParams.get("start") || timeRanges[0].value
  );
  const [type, setType] = useState();

  const [topology, setTopology] = useState();
  const [logs, setLogs] = useState([]);
  const [topologies, setTopologies] = useState([]);

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
        setType(result.components[0].type);
      } else {
        setTopology(result);
        setType(result.type);
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
        const topologyList = result.data.map((item) => {
          return {
            icon: <Icon name={item.icon} size="2xl" />,
            description: item.name,
            label: item.name,
            value: item.id
          };
        });
        setTopologies(topologyList);
      } catch (ex) {
        setTopologies([]);
      }
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
    const values = getValues();
    if (!values.topologyId || !type) {
      return;
    }

    saveQueryParams();
    setLoading(true);

    const queryBody = {
      query,
      id: externalId,
      ...values,
      type
    };
    getLogs(queryBody).then((res) => {
      setLogs(res?.data?.results || []);
      setLoading(false);
    });
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
  }, [start, type, topologyId]);

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
        <div className="px-4 py-5 sm:px-6 min-h-screen	">
          <Dropdown
            control={control}
            name="topologyId"
            className="w-80 mr-2 flex-shrink-0"
            items={topologies}
            placeholder="Select Topology"
          />
        </div>
      )}
      {loading && <Loading text="Loading logs..." />}
      {loaded && <LogsViewer logs={logs} />}
    </SearchLayout>
  );
}
