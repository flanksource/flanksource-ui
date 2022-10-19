import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ImLifebuoy } from "react-icons/im";
import { Link } from "react-router-dom";
import { Incident } from "../../api/services/incident";
import CollapsiblePanel from "../CollapsiblePanel";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { IncidentTypeTag } from "../incidentTypeTag";
import { Loading } from "../Loading";
import TopologyOpenIncidentsFilterBar, {
  IncidentFilter
} from "../TopologyOpenIncidentsFilterBar";

export function useConfigIncidents(configID: string) {
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
      const params = [
        ...(filterIncidentOptions.status.toLowerCase() !== "all"
          ? [
              `hypotheses.incidents.status=eq.${filterIncidentOptions.status.toLowerCase()}`
            ]
          : []),
        ...(filterIncidentOptions.type.toLowerCase() !== "all"
          ? [
              `hypotheses.incidents.type=eq.${filterIncidentOptions.type.toLocaleLowerCase()}`
            ]
          : [])
      ];
      const res = await fetch(
        `/api/incidents_db/evidences?type=eq.config&evidence->>id=eq.${configID}&select=hypotheses(incidents!hypotheses_incident_id_fkey!inner(id, title, status, type, created_at))&${params.join(
          "&"
        )}`
      );
      const data = (await res.json()) as Record<string, any>[];
      setIsLoading(false);
      if (data.length === 1 && !data[0].hypotheses) {
        setIncidents([]);
        return;
      }
      setIncidents(data.map((item) => item.hypotheses.incidents));
    }

    fetchIncidents();
  }, [filterIncidentOptions.status, filterIncidentOptions.type, configID]);

  return {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  };
}

type Props = {
  configID: string;
};

function ConfigIncidentsContent({ configID }: Props) {
  const {
    incidents,
    isLoading,
    filterIncidentOptions,
    setFilterIncidentOptions
  } = useConfigIncidents(configID);

  return (
    <div className="flex flex-col space-y-4">
      <TopologyOpenIncidentsFilterBar
        defaultValues={filterIncidentOptions}
        onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
      />

      {isLoading ? (
        <Loading />
      ) : incidents.length > 0 ? (
        <ol className="w-full text-sm text-left">
          {incidents.map((incident) => (
            <div className="flex flex-col space-y-2">
              <div className="block font-semibold">
                <Link
                  className="block"
                  to={{
                    pathname: `/incidents/${incident.id}`
                  }}
                >
                  {incident.title}
                </Link>
              </div>
              <div className="flex flex-row space-x-2 text-gray-500 items-center">
                <div className="flex flex-row space-x-1">
                  <IncidentTypeTag textClassName="" type={incident.type!} />
                </div>
                <span>/</span>
                <div className="flex flex-row space-x-1">
                  {dayjs(incident.created_at).fromNow()}
                </div>
                <span>/</span>
                <div className="flex flex-row space-x-1">
                  <span className="">Status:</span>
                  <IncidentStatusTag status={incident.status!} />
                </div>
              </div>
            </div>
          ))}
        </ol>
      ) : (
        <div className="flex flex-row justify-center items-center space-x-2 text-gray-500 text-center">
          <FaExclamationTriangle />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

export default function ConfigIncidents(props: Props) {
  return (
    <CollapsiblePanel
      Header={
        <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
          <ImLifebuoy className="text-gray-400" />
          <span> Incidents</span>
        </h3>
      }
    >
      <ConfigIncidentsContent {...props} />
    </CollapsiblePanel>
  );
}
