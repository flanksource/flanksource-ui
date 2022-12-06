import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import { Chip } from "../Chip";
import { typeItems, severityItems } from "../Incidents/data";

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

type IncidentSummarySeverity = "Medium" | "Low" | "High";

type TopologyCardIncidentSummaryItemProps = {
  severity: IncidentSummarySeverity;
  value: number;
  topology: Pick<Topology, "id">;
  index: number;
};

function TopologyCardIncidentSummaryItem({
  severity,
  value,
  topology,
  index
}: TopologyCardIncidentSummaryItemProps) {
  const severityObject = useMemo(() => {
    return severityItems[severity];
  }, [severity]);

  return (
    <Link
      to={`/incidents?severity=${severityObject.value}&component=${topology.id}`}
    >
      <Chip color={chipColorFromIndex(index)} text={value} />
    </Link>
  );
}

type TopologyCardIncidentSummaryProps = {
  topology: Pick<Topology, "summary" | "id">;
};

export default function TopologyCardIncidentSummary({
  topology
}: TopologyCardIncidentSummaryProps) {
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
                    <TopologyCardIncidentSummaryItem
                      index={i}
                      severity={key as IncidentSummarySeverity}
                      topology={topology}
                      value={value}
                    />
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
