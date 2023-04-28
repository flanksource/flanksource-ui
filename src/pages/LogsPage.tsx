import { SearchIcon } from "@heroicons/react/solid";
import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { SearchLayout } from "../components/Layout";
import { TextInput } from "../components/TextInput";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import FilterLogsByComponent from "../components/FilterLogs/FilterLogsByComponent";
import { useQuery } from "@tanstack/react-query";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { LogsTable } from "../components/Logs/Table/LogsTable";
import useDebouncedValue from "../hooks/useDebounce";
import { getTopologyComponentByID } from "../api/services/topology";
import { Head } from "../components/Head/Head";
import { useComponentGetLogsQuery } from "../api/query-hooks";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../components/BreadcrumbNav";
import { TopologyLink } from "../components/TopologyLink";

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
  } = useComponentGetLogsQuery(
    {
      externalId: externalId!,
      type: type!,
      query: debouncedQueryValue!,
      start
    },
    {
      enabled: !!topologyId || !!query
    }
  );

  return (
    <>
      <Head prefix={topology?.name ? `Logs - ${topology.name}` : "Logs"} />
      <SearchLayout
        onRefresh={() => refetch()}
        loading={topologyId ? isLoading || isFetching || isRefetching : false}
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/logs">Logs</BreadcrumbRoot>,
              topology?.name && (
                <BreadcrumbChild>
                  <TopologyLink viewType="label" topologyId={topology.id} />
                </BreadcrumbChild>
              )
            ].filter((v) => v)}
          />
        }
        contentClass={`h-full p-6`}
        extra={
          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange name="time-range" />}
            defaultValue={searchParams.get("start") ?? timeRanges[0].value}
            paramKey="start"
            className="w-44 mr-2"
            name="time-range"
          />
        }
      >
        <div className="flex flex-col space-y-6 h-full">
          <div className="flex flex-row items-center w-full">
            <FilterLogsByComponent />

            <div className="mx-2 w-80 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <button
                  type="button"
                  onClick={() => refetch()}
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
    </>
  );
}
