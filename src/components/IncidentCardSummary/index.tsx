import { useMemo } from "react";
import { IncidentSeverity } from "../../api/services/incident";
import { Topology } from "../../context/TopologyPageContext";
import { typeItems, severityItems } from "../Incidents/data";
import { StatusLine, StatusLineProps } from "../StatusLine/StatusLine";

const chipColorFromSeverity = (
  severity: IncidentSeverity
): "green" | "orange" | "red" | "gray" => {
  switch (severity) {
    case IncidentSeverity.Low:
    case IncidentSeverity.Medium:
      return "green";
    case IncidentSeverity.High:
      return "orange";
    case IncidentSeverity.Critical:
    case IncidentSeverity.Blocker:
      return "red";
    default:
      return "green";
  }
};

type IncidentSummaryTypes = keyof typeof typeItems;

type IncidentCardSummaryProps = {
  topology: Pick<Topology, "summary" | "id">;
};

export default function IncidentCardSummary({
  topology
}: IncidentCardSummaryProps) {
  const statusLines: StatusLineProps[] = useMemo(() => {
    const incidentSummary = Object.entries(topology?.summary?.incidents || {});
    return incidentSummary.map(([key, summary]) => {
      const statusLine: StatusLineProps = {
        icon: typeItems[key as IncidentSummaryTypes].icon,
        label: typeItems[key as IncidentSummaryTypes].description,
        url: `/incidents?type=${key}`,
        statuses: []
      };
      Object.entries(summary).forEach(([key, value], i) => {
        if (value <= 0) {
          return;
        }
        const severityObject =
          severityItems[key as IncidentSeverity] || severityItems.Low;
        const item = {
          label: value.toString(),
          color: chipColorFromSeverity(key as IncidentSeverity),
          url: `/incidents?severity=${severityObject.value}&component=${topology.id}`
        };
        statusLine.statuses.push(item);
      });
      return statusLine;
    });
  }, [topology]);

  if (!topology.summary?.incidents) {
    return null;
  }

  return (
    <>
      {statusLines.map((statusLine, index) => {
        return <StatusLine key={index} {...statusLine} />;
      })}
    </>
  );
}
