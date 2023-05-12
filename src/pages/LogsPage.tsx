import { BsGearFill, BsFlower2, BsGridFill, BsStack } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { SearchLayout } from "../components/Layout";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
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
import LogsFilterBar from "../components/FilterLogs/LogsFilterBar";

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
  const [searchParams] = useSearchParams();

  const topologyId = searchParams.get("topologyId");
  const query = searchParams.get("query");
  const debouncedQueryValue = useDebouncedValue(query, 500);
  const logsSelector = searchParams.get("logsSelector");

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
      query: debouncedQueryValue ?? undefined,
      logSelector: logsSelector!,
      id: topologyId!
    },
    {
      enabled: !!topologyId && !!logsSelector
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
          <LogsFilterBar refetch={refetch} />
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
