import { SearchIcon } from "@heroicons/react/solid";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLogs } from "../api/services/logs";
import { getTopology } from "../api/services/topology";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { LogsViewer } from "../components/Logs";
import { TextInput } from "../components/TextInput";

export function LogsPage() {
  const [logsIsLoading, setLogsIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const topologyId = searchParams.get("topologyId");
  const [topology, setTopology] = useState(null);
  useEffect(() => {
    if (topologyId != null && topology == null) {
      getTopology({ id: topologyId }).then((topology) => {
        let result = topology.data[0]

        if (isEmpty(result.id) && result.components != null && result.components.length == 1) {
          setTopology(result.components[0])
        } else {
          setTopology(result);
        }
      });
    }
  });

  const saveQueryParams = () => {
    const params = {};
    if (!isEmpty(query)) {
      params.query = query;
    }
    if (!isEmpty(topologyId)) {
      params.topologyId = topologyId;
    }
    setSearchParams(params);
  };

  const [logs, setLogs] = useState([]);
  const loadLogs = () => {

    if (topology == null) {
      setLogsIsLoading(false);
      return null;
    }
    saveQueryParams();
    setLogsIsLoading(true);

    const queryBody = {
      query,
      type: topology.type,
      id: topology.external_id
    };
    console.log("search", queryBody);

    getLogs(queryBody).then((res) => {
      if (res.data != null) {
        setLogs(res.data.results);
      }
      setLogsIsLoading(false);
    });
  };

  useEffect(() => {
    loadLogs();
  }, [topology]);

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
      onRefresh={loadLogs}
      extra={
        <>
          <div className="mr-4 w-72 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button type="button" onClick={loadLogs} className="hover">
                <SearchIcon
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  aria-hidden="true"
                />
              </button>
            </div>
            <TextInput
              placeholder="Search"
              className="pl-10 pb-2.5 w-full"
              style={{ height: "38px" }}
              id="searchQuery"
              onEnter={loadLogs}
              onChange={(e) => {
                e.preventDefault();
                setQuery(e.target.value);
              }}
              value={query}
            />
          </div>
          {/* <Dropdown
            control={control}
            name="timeRange"
            className="w-44"
            items={timeRanges}
          />
          <Dropdown
            control={control}
            name="type"
            className="w-44"
            items={[
              {
                icon: <Icon name="kubernetes" />,
                description: "Node",
                value: "KubernetesNode"
              },
              {
                icon: <Icon name="kubernetes" />,
                description: "Pod",
                value: "KubernetesDeployment"
              }
            ]}
          /> */}
        </>
      }
    >
      <LogsViewer logs={logs} isLoading={logsIsLoading} />
    </SearchLayout>
  );
}
