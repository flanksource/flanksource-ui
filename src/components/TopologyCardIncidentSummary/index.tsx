import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Incident, IncidentSeverity } from "../../api/services/incident";
import { Chip } from "../Chip";
import { typeItems } from "../Incidents/data";

type TopologyIncidentSummary = {
  hypotheses: {
    incidents: Pick<Incident, "type" | "id" | "status" | "severity">[];
  };
};

type IncidentSummary = {
  type: string;
  id: string;
  status: string;
  count: number;
  severity: IncidentSeverity;
};

type Props = {
  topologyID: string;
};

const chipColorFromIndex = (index: number) => {
  switch (index) {
    case 0:
      return "green";
    case 1:
      return "orange";
    case 2:
      return "red";
    default:
      return "green";
  }
};

export default function TopologyCardIncidentSummary({ topologyID }: Props) {
  const [incidentSummary, setIncidentSummary] =
    useState<
      Map<
        keyof typeof typeItems,
        [IncidentSummary, IncidentSummary, IncidentSummary]
      >
    >();

  const { isLoading, data } = useQuery(
    ["topology", "incidents", "summary", topologyID],
    async () => {
      const res = await fetch(
        `/api/incidents_db/evidences?select=hypotheses!evidences_hypothesis_id_fkey!inner(incidents!hypotheses_incident_id_fkey!inner(id,type,status,severity))&evidence->>id=eq.${topologyID}&hypotheses.incidents.status=eq.open`
      );
      const data = (await res.json()) as TopologyIncidentSummary[];
      const incidents = data.map((d) => d.hypotheses.incidents).flat();
      return incidents;
    }
  );

  useEffect(() => {
    if (data) {
      // do a summary of the incidents by type i.e. count the number of incidents of each type
      const incidentsByTypeSummaries = new Map<
        keyof typeof typeItems,
        [IncidentSummary, IncidentSummary, IncidentSummary]
      >();
      data.forEach(({ type: incidentType, status, severity, id }) => {
        if (incidentType) {
          const type = incidentType as keyof typeof typeItems;
          const count = incidentsByTypeSummaries.get(type);
          const low: IncidentSummary = {
            type: type,
            count:
              severity === IncidentSeverity.Low
                ? (count?.[0].count || 0) + 1
                : count?.[0].count || 0,
            id: id,
            status: status!,
            severity: IncidentSeverity.Low
          };
          const medium: IncidentSummary = {
            type: type,
            count:
              severity === IncidentSeverity.Medium
                ? (count?.[1].count || 0) + 1
                : count?.[1].count || 0,
            id: id,
            status: status!,
            severity: IncidentSeverity.Medium
          };
          const high: IncidentSummary = {
            type: type,
            count:
              severity === IncidentSeverity.High
                ? (count?.[2].count || 0) + 1
                : count?.[2].count || 0,
            id: id,
            status: status!,
            severity: IncidentSeverity.High
          };
          incidentsByTypeSummaries.set(type, [low, medium, high]);
        }
      });
      setIncidentSummary(incidentsByTypeSummaries);
    }
  }, [data]);

  if (isLoading || !incidentSummary || incidentSummary.size === 0) {
    return null;
  }

  return (
    <div className="flex flex-row space-x-2 py-1 text-sm items-center">
      <div className="flex-1 flex flex-col">
        {incidentSummary &&
          Array.from(incidentSummary.entries()).map(([type, count]) => (
            <div
              key={type}
              className="flex flex-row space-x-2 items-center rounded text-black"
            >
              <div className="flex flex-row space-x-2 items-center">
                {typeItems[type].icon}
                <span>{typeItems[type].description}</span>
              </div>
              <div className="flex flex-row space-x-2">
                {count.map(
                  (severity, i) =>
                    severity.count > 0 && (
                      <Link
                        to={`/incidents?severity=${severity.severity}&component=${topologyID}`}
                      >
                        <Chip
                          key={severity.type + i}
                          color={chipColorFromIndex(i)}
                          text={severity.count}
                        />
                      </Link>
                    )
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
