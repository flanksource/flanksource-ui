import { BsFlower2, BsGearFill, BsGridFill, BsStack } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import {
  useComponentGetLogsQuery,
  useComponentNameQuery
} from "../api/query-hooks";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import LogsFilterBar from "../components/Logs/FilterLogs/LogsFilterBar";
import { LogsTable } from "../components/Logs/Table/LogsTable";
import { TopologyLink } from "../components/Topology/TopologyLink";
import useDebouncedValue from "../hooks/useDebounce";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../ui/BreadcrumbNav";
import { Head } from "../ui/Head";
import { SearchLayout } from "../ui/Layout/SearchLayout";

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

  const { data: topology } = useComponentNameQuery(topologyId || "", {
    enabled: topologyId != null
  });

  const {
    isLoading,
    isFetching,
    isRefetching,
    data: logs,
    refetch
  } = useComponentGetLogsQuery(
    {
      query: debouncedQueryValue ?? undefined,
      name: logsSelector!,
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
              <BreadcrumbRoot link="/logs" key="/logs">
                Logs
              </BreadcrumbRoot>,
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
            className="mr-2 w-44"
            name="time-range"
          />
        }
      >
        <div className="flex h-full flex-col space-y-6">
          <LogsFilterBar refetch={refetch} />
          <LogsTable
            variant="comfortable"
            isLoading={isLoading}
            logs={logs?.results ?? []}
            areQueryParamsEmpty={(!!topologyId && !!logsSelector) === false}
            componentId={topology?.id}
          />
        </div>
      </SearchLayout>
    </>
  );
}
