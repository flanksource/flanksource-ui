import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ImLifebuoy } from "react-icons/im";
import { getIncidentsBy } from "../../api/services/incident";
import CollapsiblePanel from "../CollapsiblePanel";
import IncidentsFilterBar, { IncidentFilter } from "../IncidentsFilterBar";
import Title from "../Title/title";
import { relativeDateTime } from "../../utils/date";
import { Link } from "react-router-dom";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { IncidentTypeIcon } from "../incidentTypeTag";
import { DetailsTable } from "../DetailsTable/DetailsTable";
import { Badge } from "../Badge";

type Props = {
  topologyId?: string;
  configId?: string;
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

export default function Incidents({ topologyId, configId }: Props) {
  const [filterIncidentOptions, setFilterIncidentOptions] =
    useState<IncidentFilter>({
      type: "all",
      status: "open",
      age: 0
    });

  const { isLoading, data } = useQuery(
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
      Header={
        <div className="flex flex-row items-center justify-center space-x-2">
          <Title
            title="Incidents"
            icon={<ImLifebuoy className="w-6 h-auto" />}
          />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={incidents?.length ?? 0}
          />
          <div className="ml-5 text-right grow">
            <IncidentsFilterBar
              defaultValues={filterIncidentOptions}
              onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
            />
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <div className="flex flex-col space-y-1">
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
