import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ImLifebuoy } from "react-icons/im";
import { getIncidentsByComponent, Incident } from "../../api/services/incident";
import IncidentCard from "../IncidentCard/IncidentCard";
import { Loading } from "../Loading";
import TopologyOpenIncidentsFilterBar, {
  IncidentFilter
} from "../TopologyOpenIncidentsFilterBar";

type Props = {
  topologyID: string;
};

export function useTopologyIncidents(topologyId: string) {
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
      setIsLoading(true);
      const res = await getIncidentsByComponent(
        topologyId,
        filterIncidentOptions.type,
        filterIncidentOptions.status
      );
      setIncidents(res.data);
      setIsLoading(false);
    }

    fetchIncidents();
  }, [filterIncidentOptions.status, filterIncidentOptions.type, topologyId]);

  return {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  };
}

export default function TopologySidebarIncidents({ topologyID }: Props) {
  const {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  } = useTopologyIncidents(topologyID);

  return (
    <div className="flex flex-col ">
      <div className="flex flex-row object-center border-b border-solid pb-1 border-zinc-100">
        <h4>
          <ImLifebuoy className="text-gray-400 inline-block" />
          <span> Incidents</span>
        </h4>
        <div className="ml-5 mt-1">
          <TopologyOpenIncidentsFilterBar
            defaultValues={filterIncidentOptions}
            onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
          />
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col space-y-1">
          {isLoading ? (
            <Loading />
          ) : incidents.length > 0 ? (
            incidents.map((incident) => (
              <IncidentCard incident={incident} key={incident.id} />
            ))
          ) : (
            <div className="flex flex-row justify-center items-center py-4 space-x-4 text-gray-400">
              <FaExclamationTriangle className="text-xl" />
              <span>No details found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
