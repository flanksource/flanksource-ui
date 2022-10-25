import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { Incident } from "../../api/services/incident";
import { typeItems } from "../Incidents/data";

type TopologyIncidentSummary = {
  hypotheses: {
    incidents: Pick<Incident, "type" | "id" | "status">[];
  };
};

type Props = {
  topologyID: string;
};

export default function TopologyCardIncidentSummary({ topologyID }: Props) {
  const [incidentSummary, setIncidentSummary] =
    useState<Map<keyof typeof typeItems, number>>();

  const { isLoading, data } = useQuery(
    ["topology", "incidents", "summary", topologyID],
    async () => {
      const res = await fetch(
        `/api/incidents_db/evidences?select=hypotheses!evidences_hypothesis_id_fkey!inner(incidents!hypotheses_incident_id_fkey!inner(id,type,status))&evidence->>id=eq.${topologyID}&hypotheses.incidents.status=eq.open`
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
        number
      >();
      data.forEach((incident) => {
        if (incident?.type) {
          const type = incident.type as keyof typeof typeItems;
          const count = incidentsByTypeSummaries.get(type) || 0;
          incidentsByTypeSummaries.set(type, count + 1);
        }
      });
      setIncidentSummary(incidentsByTypeSummaries);
    }
  }, [data]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (isLoading || !incidentSummary || incidentSummary.size === 0) {
    return null;
  }

  return (
    <div className="flex flex-row space-x-2 px-2 py-1 text-xs items-center">
      <div className="w-auto">Incident Summary:</div>
      <div className="flex-1 flex flex-row items-center">
        {incidentSummary &&
          Array.from(incidentSummary.entries()).map(([type, count]) => (
            <div
              data-tip={typeItems[type].description}
              data-class="max-w-[20rem]"
              key={type}
              className="flex flex-row space-x-2 font-semibold items-center rounded text-black shadow-sm bg-gray-100 px-2 py-1"
            >
              <div>{typeItems[type].icon}</div>
              <div className="flex flex-row">{count}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
