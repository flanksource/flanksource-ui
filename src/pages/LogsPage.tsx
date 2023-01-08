import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/solid";
import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { getLogs } from "../api/services/logs";
import { SearchLayout } from "../components/Layout";
import { TextInput } from "../components/TextInput";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import FilterLogsByComponent from "../components/FilterLogs/FilterLogsByComponent";
import { useQuery } from "@tanstack/react-query";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { LogsTable } from "../components/Logs/Table/LogsTable";
import useDebouncedValue from "../hooks/useDebounce";
import LogItem from "../types/Logs";
import { getTopologyComponentByID } from "../api/services/topology";
import { TimeRangePicker } from "../components/TimeRangePicker";
import { Icons } from "../../icons";
import { Icon } from "../Icon";
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
  const start = searchParams.get("start") ?? timeRanges[0].value;
  const [showDeleted, setShowDeleted] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [showExisting, setShowExisting] = useState(false);

  const debouncedQueryValue = useDebouncedValue(query, 500);
  const { data: topology } = useQuery(
    ["components", "names", topologyId],
    async () => {
      if (topologyId) {
        const data = await getTopologyComponentByID(topologyId);
        return data;
      }
    },
    {
      enabled: !!topologyId
    }
  );

  const {
    isLoading,
    isFetching,
    isRefetching,
    data: logs,
    refetch
  } = useQuery(
    // use the different filters as a key for the cache
    ["topology", "logs", externalId, type, debouncedQueryValue, start],
    async () => {
      const queryBody = {
        query: debouncedQueryValue,
        id: externalId,
        type,
        start
      };
      const res = await getLogs(queryBody);
      if (res.error) {
        throw res.error;
      }
      return res.data.results as LogItem[];
    },
    {
      enabled: !!topologyId || !!query
    }
  );

  const handleComponentsView = (option: string) => {
    switch (option) {
      case "all":
        setShowAll(true);
        setShowDeleted(false);
        setShowExisting(false);
        return;
      case "deleted":
        setShowDeleted(true);
        setShowAll(false);
        setShowExisting(false);
        return;
      case "existing":
        setShowExisting(true);
        setShowDeleted(false);
        setShowAll(false);
        return;
      default:
        setShowAll(true);
        setShowDeleted(false);
        setShowExisting(false);
        return;
    }
  };

  return (
    <SearchLayout
      onRefresh={() => refetch()}
      loading={isLoading || isFetching || isRefetching}
      title={
        <h1 className="text-xl font-semibold">
          Logs{topology?.name ? `/${topology.name}` : ""}
        </h1>
      }
      contentClass={`h-full p-6`}
      extra={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            columnGap: "1em"
          }}
        >
          <div>
            <button
              onClick={() => handleComponentsView("all")}
              style={{
                color: showAll ? "#63666A" : "lightgrey",
                fontWeight: showAll ? "bolder" : "lighter"
              }}
              title={"show all components"}
            >
              All
            </button>
          </div>
          <div>
            <button
              onClick={() => handleComponentsView("deleted")}
              style={{
                color: showDeleted ? "#63666A" : "lightgrey",
                fontWeight: showDeleted ? "bolder" : "lighter"
              }}
              title={"show deleted components"}
            >
              Deleted
            </button>
          </div>
          <div>
            <button
              onClick={() => handleComponentsView("existing")}
              style={{
                color: showExisting ? "#63666A" : "lightgrey",
                fontWeight: showExisting ? "bolder" : "lighter"
              }}
              title={"show components not deleted"}
            >
              Existing
            </button>
          </div>

          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange name="time-range" />}
            defaultValue={start ?? "15m"}
            paramKey="start"
            className="w-44 mr-2"
          />
        </div>
      }
    >
      <div className="flex flex-col space-y-6 h-full">
        <div className="flex flex-row items-center w-full">
          <FilterLogsByComponent
            showDeleted={showDeleted}
            showAll={showAll}
            showExisting={showExisting}
          />
          <div className="mx-2 w-80 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button type="button" onClick={() => refetch()} className="hover">
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
                if (e.target.value !== "") {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    query: e.target.value
                  });
                } else {
                  searchParams.delete("query");
                  setSearchParams(searchParams);
                }
              }}
              defaultValue={query ?? undefined}
            />
          </div>
        </div>
        <LogsTable
          variant="comfortable"
          isLoading={isLoading}
          logs={logs ?? []}
          areQueryParamsEmpty={!topologyId && !query}
          componentId={topology?.id}
        />
      </div>
    </SearchLayout>
  );
}
