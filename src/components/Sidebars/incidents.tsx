import { useEffect, useState } from "react";
import { ImLifebuoy } from "react-icons/im";
import { getIncidentsBy, Incident } from "../../api/services/incident";
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

export function useTopologyIncidents(topologyId: string, configId: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [filterIncidentOptions, setFilterIncidentOptions] =
    useState<IncidentFilter>({
      type: "all",
      status: "Open",
      age: 0
    });

  useEffect(() => {
    async function fetchIncidents() {
      if (topologyId == null && configId == null) {
        console.error("Missing topologyId or configId");
      }

      setIsLoading(true);

      const res = await getIncidentsBy({
        topologyId: topologyId,
        configId: configId,
        type: filterIncidentOptions.type,
        status: filterIncidentOptions.status
      });
      setIncidents(res.data);
      setIsLoading(false);
    }

    fetchIncidents();
  }, [
    filterIncidentOptions.status,
    filterIncidentOptions.type,
    topologyId,
    configId
  ]);

  return {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  };
}

export default function Incidents({ topologyId, configId }: Props) {
  const {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  } = useTopologyIncidents(topologyId, configId);

  return (
    <CollapsiblePanel
      Header={
        <>
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
        </>
      }
    >
      <div className="flex flex-col mt-2">
        <div className="flex flex-col space-y-1">
          {isLoading ? (
            <Loading />
          ) : incidents.length > 0 ? (
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
