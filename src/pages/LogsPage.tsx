import { SearchIcon } from "@heroicons/react/solid";
import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getLogs } from "../api/services/logs";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { LogsViewer } from "../components/Logs";
import { TextInput } from "../components/TextInput";
import { timeRanges } from "../components/Dropdown/TimeRange";
import { ReactSelectDropdown } from "../components/ReactSelectDropdown";
import FilterLogsByComponent from "../components/FilterLogs/FilterLogsByComponent";
import { useQuery } from "@tanstack/react-query";
import { TopologyComponentItem } from "../components/FilterIncidents/FilterIncidentsByComponents";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const topologyId = searchParams.get("topologyId");
  const type = searchParams.get("type");
  const externalId = searchParams.get("topologyExternalId");
  const query = searchParams.get("query");

  console.log(topologyId, type, externalId);

  const [start, setStart] = useState(
    searchParams.get("start") || timeRanges[0].value
  );

  const { data: topology } = useQuery(
    ["components", "names", topologyId],
    async () => {
      const res = await fetch(
        `/api/canary/db/component_names?id=eq.${topologyId}`
      );
      const data = (await res.json()) as TopologyComponentItem[];
      return data[0];
    },
    {
      enabled: !!topologyId
    }
  );

  const {
    isLoading,
    data: logs,
    refetch
  } = useQuery(
    ["topology", "logs", topologyId],
    async () => {
      const queryBody = {
        query,
        id: topologyId,
        type,
        start
      };
      const res = await getLogs(queryBody);
      if (res.error) {
        throw res.error;
      }
      return res.data;
    },
    {
      enabled: !!topologyId
    }
  );

  return (
    <SearchLayout
      onRefresh={() => refetch()}
      title={
        <h1 className="text-xl font-semibold">
          Logs{topology?.name ? `/${topology.name}` : ""}
        </h1>
      }
      contentClass={`h-full py-4 px-6 ${logs ? "p-6" : ""}`}
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
          <FilterLogsByComponent />

          <div className="mx-2 w-80 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button
                type="button"
                // onClick={() => loadLogs()}
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
              onChange={(e) => {
                e.preventDefault();
                setSearchParams({
                  ...Object.entries(searchParams),
                  query: e.target.value
                });
              }}
              value={query ?? undefined}
            />
          </div>
        </div>
        {isLoading && topologyId && (
          <Loading className="mt-40" text="Loading logs..." />
        )}
        {topologyId && logs && (
          // @ts-expect-error
          <LogsViewer className="pt-4" logs={logs} />
        )}
        {!topologyId && (
          <div className="flex flex-col justify-center items-center h-5/6">
            <h3 className="text-center font-semibold text-lg">
              Please select a component to view the logs.
            </h3>
          </div>
        )}
      </div>
    </SearchLayout>
  );
}
