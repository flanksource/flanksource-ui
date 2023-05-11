import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ImLifebuoy } from "react-icons/im";
import { Link } from "react-router-dom";
import { getIncidentsBy } from "../../api/services/incident";
import { relativeDateTime } from "../../utils/date";
import PillBadge from "../Badge/PillBadge";
import CollapsiblePanel from "../CollapsiblePanel";
import { DetailsTable } from "../DetailsTable/DetailsTable";
import { IncidentStatusTag } from "../IncidentStatusTag";
import IncidentsFilterBar, { IncidentFilter } from "../IncidentsFilterBar";
import Title from "../Title/title";
import { IncidentTypeIcon } from "../incidentTypeTag";
import { useAtom } from "jotai";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";

type Props = {
  topologyId?: string;
  configId?: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

const columns = [
  {
    key: "incident",
    label: "Incident"
  },
  {
    key: "age",
    label: "Age"
  }
];

export default function Incidents({
  topologyId,
  configId,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const [filterIncidentOptions, setFilterIncidentOptions] =
    useState<IncidentFilter>({
      type: "all",
      status: "open",
      age: 0
    });

  const { isLoading, data, isRefetching, refetch } = useQuery(
    [
      "incidents",
      ...(topologyId ? ["topology-", topologyId] : []),
      ...(configId ? ["configs", configId] : []),
      filterIncidentOptions.status,
      filterIncidentOptions.type
    ],
    async () => {
      const res = await getIncidentsBy({
        topologyId: topologyId,
        configId: configId,
        type: filterIncidentOptions.type,
        status: filterIncidentOptions.status
      });
      return res.data ?? [];
    },
    {
      enabled: !!topologyId || !!configId
    }
  );

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  const incidents = useMemo(() => {
    return data?.map((item) => {
      return {
        incident: (
          <div className="flex flex-row">
            <IncidentTypeIcon type={item.type!} />
            <Link
              className="block mx-1 cursor-pointer"
              to={{
                pathname: `/incidents/${item.id}`
              }}
            >
              {item.title}
            </Link>
            <IncidentStatusTag status={item.status!} className="ml-1" />
          </div>
        ),
        age: relativeDateTime(item.created_at)
      };
    });
  }, [data]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row items-center justify-center space-x-2">
          <Title
            title="Incidents"
            icon={<ImLifebuoy className="w-6 h-auto" />}
          />
          <PillBadge>{incidents?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={incidents?.length}
      childrenClassName=""
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-start relative">
          <IncidentsFilterBar
            defaultValues={filterIncidentOptions}
            onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
          />
        </div>
        <div className="flex max-h-full overflow-y-auto flex-col space-y-1">
          <DetailsTable
            loading={isLoading}
            data={incidents || []}
            columns={columns}
            showHeader={false}
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
