import { SearchIcon } from "@heroicons/react/solid";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import {
  BsGearFill,
  BsFlower2,
  BsGridFill,
  BsStack,
  BsListOl
} from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLogs } from "../api/services/logs";
import { getTopology } from "../api/services/topology";
import { Dropdown } from "../components/Dropdown";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { LogsViewer } from "../components/Logs";
import { TextInput } from "../components/TextInput";
import { timeRanges } from "../components/Dropdown/TimeRange";
import { RefreshButton } from "../components/RefreshButton";

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
  const [logsIsLoading, setLogsIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  // eslint-disable-next-line no-unused-vars
  const [topologyId, setTopologyId] = useState(searchParams.get("topologyId"));
  const [externalId, setExternalId] = useState(searchParams.get("externalId"));
  const [topology, setTopology] = useState(null);
  const [logs, setLogs] = useState([]);

  const { control, getValues } = useForm({
    defaultValues: {
      type: searchParams.get("type") || logTypes[0].value,
      start: searchParams.get("start") || timeRanges[0].value
    }
  });

  useEffect(() => {
    if (topologyId != null && topology == null) {
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
    }
  }, []);

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

  const loadLogs = () => {
    saveQueryParams();
    setLogsIsLoading(true);

    const queryBody = {
      query,
      id: externalId,
      ...getValues()
    };

    getLogs(queryBody).then((res) => {
      if (res.data != null) {
        setLogs(res.data.results);
      }
      setLogsIsLoading(false);
    });
  };

  useEffect(() => {
    loadLogs();
  }, [topologyId]);

  if (!isEmpty(topologyId) && topology == null) {
    return <Loading text={`Loading topology ${topologyId}`} />;
  }

  return (
    <SearchLayout
      title={
        <div>
          <h1 className="text-xl font-semibold">
            Logs
            {topology != null && (
              <span className="text-gray-600">
                / {topology.name || topology.text}
              </span>
            )}
          </h1>
        </div>
      }
      extra={
        <>
          <Dropdown
            control={control}
            name="type"
            className="w-36 mr-2 flex-shrink-0"
            items={logTypes}
          />
          <div className="mr-2 w-full relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button
                type="button"
                onClick={() => loadLogs()}
                className="hover"
              >
                <BsListOl
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  aria-hidden="true"
                />
              </button>
            </div>
            <TextInput
              placeholder="External ID"
              className="pl-10 pb-2.5 w-full flex-shrink-0"
              style={{ height: "38px" }}
              id="externalId"
              onChange={(e) => {
                e.preventDefault();
                setExternalId(e.target.value);
              }}
              onEnter={() => loadLogs()}
              value={externalId}
            />
          </div>
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
      <LogsViewer logs={logs} isLoading={logsIsLoading} />
    </SearchLayout>
  );
}
