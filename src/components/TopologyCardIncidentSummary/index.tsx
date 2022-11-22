import { Link } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import { Chip } from "../Chip";
import { typeItems, severityItems } from "../Incidents/data";

type Props = {
  topology: Pick<Topology, "summary" | "id">;
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

type IncidentSummaryTypes = keyof typeof typeItems;

type IncidentSummarySeverity = keyof typeof severityItems;

export default function TopologyCardIncidentSummary({ topology }: Props) {
  if (!topology.summary?.incidents) {
    return null;
  }

  const incidentSummary = Object.entries(topology.summary.incidents);

  return (
    <div className="flex flex-row space-x-2 py-1 text-sm items-center">
      <div className="flex-1 flex flex-col">
        {incidentSummary.map(([key, summary]) => (
          <div
            key={key}
            className="flex flex-row space-x-1 items-center rounded text-black"
          >
            <div className="flex flex-row space-x-1 items-center">
              <div>{typeItems[key as IncidentSummaryTypes].icon}</div>
              <div className="text-xs">
                {typeItems[key as IncidentSummaryTypes].description}
              </div>
            </div>
            <div className="flex flex-row space-x-2">
              {Object.entries(summary).map(
                ([key, value], i) =>
                  value > 0 && (
                    <Link
                      key={key + topology.id}
                      to={`/incidents?severity=${
                        severityItems[key as unknown as IncidentSummarySeverity]
                          .value
                      }&component=${topology.id}`}
                    >
                      <Chip color={chipColorFromIndex(i)} text={value} />
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
