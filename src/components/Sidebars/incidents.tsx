import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ImLifebuoy } from "react-icons/im";
import { getIncidentsBy } from "../../api/services/incident";
import CollapsiblePanel from "../CollapsiblePanel";
import EmptyState from "../EmptyState";
import IncidentCard from "../IncidentCard/IncidentCard";
import IncidentsFilterBar, { IncidentFilter } from "../IncidentsFilterBar";
import { Loading } from "../Loading";
import Title from "../Title/title";

type Props = {
  topologyId?: string;
  configId?: string;
};

export default function Incidents({ topologyId, configId }: Props) {
  const [filterIncidentOptions, setFilterIncidentOptions] =
    useState<IncidentFilter>({
      type: "all",
      status: "open",
      age: 0
    });

  const { isLoading, data: incidents } = useQuery(
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

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row items-center justify-center">
          <Title
            title="Incidents"
            icon={<ImLifebuoy className="w-6 h-auto" />}
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
          {isLoading ? (
            <Loading />
          ) : incidents && incidents.length > 0 ? (
            incidents.map((incident) => (
              <IncidentCard incident={incident} key={incident.id} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </CollapsiblePanel>
  );
}
