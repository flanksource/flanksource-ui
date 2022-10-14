import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { ImLifebuoy } from "react-icons/im";
import { Link } from "react-router-dom";
import { EvidenceType } from "../../api/services/evidence";
import { Incident } from "../../api/services/incident";
import CollapsiblePanel from "../CollapsiblePanel";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { IncidentTypeTag } from "../incidentTypeTag";
import { Loading } from "../Loading";
import TopologyOpenIncidentsFilterBar, {
  IncidentFilter
} from "../TopologyOpenIncidentsFilterBar";

type Props = {
  topologyID: string;
};

export function useTopologyIncidents(topologyID: string) {
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
          ? [`status=eq.${filterIncidentOptions.status.toLowerCase()}`]
          : []),
        ...(filterIncidentOptions.type.toLowerCase() !== "all"
          ? [`type=eq.${filterIncidentOptions.type.toLocaleLowerCase()}`]
          : [])
      ];
      const res = await fetch(
        `/api/incidents_db/incidents?&select=*,hypotheses!hypotheses_incident_id_fkey(*,created_by(id,name,avatar),evidences(id,evidence,type),comments(comment,external_created_by,responder_id(team_id(*)),created_by(id,id,name,avatar),id)),commander_id(id,name,avatar),communicator_id(id,name,avatar),responders!responders_incident_id_fkey(created_by(id,name,avatar))&order=created_at.desc&${params.join(
          "&"
        )}`
      );
      const data = (await res.json()) as Incident[];
      const topologyIncidents = data.filter((incident) =>
        incident.hypotheses.some((hypothesis) =>
          hypothesis.evidences?.some(
            (evidence) =>
              evidence.evidence.id === topologyID &&
              evidence.type === EvidenceType.Topology
          )
        )
      );
      setIncidents(topologyIncidents);
      setIsLoading(false);
    }

    fetchIncidents();
  }, [filterIncidentOptions.status, filterIncidentOptions.type, topologyID]);

  return {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  };
}

export function TopologySidebarIncidents({ topologyID }: Props) {
  const {
    incidents,
    filterIncidentOptions,
    setFilterIncidentOptions,
    isLoading
  } = useTopologyIncidents(topologyID);

  return (
    <div className="flex flex-col space-y-6">
      <TopologyOpenIncidentsFilterBar
        defaultValues={filterIncidentOptions}
        onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
      />
      {isLoading ? (
        <Loading />
      ) : incidents.length > 0 ? (
        incidents.map((incident) => (
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
        ))
      ) : (
        <div className="flex flex-row justify-center items-center py-4 space-x-4 text-gray-400">
          <FaExclamationTriangle className="text-xl" />
          <span>No details found</span>
        </div>
      )}
    </div>
  );
}

// Passthrough anonymous function
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props: Props) {
  return (
    <div className="flex flex-col">
      <CollapsiblePanel
        Header={
          <h3 className="flex flex-row space-x-2 items-center text-xl font-semibold">
            <ImLifebuoy className="text-gray-400" />
            <span> Incidents</span>
          </h3>
        }
      >
        <div className="flex flex-col px-4">
          <TopologySidebarIncidents {...props} />
        </div>
      </CollapsiblePanel>
    </div>
  );
}
