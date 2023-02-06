import { useMemo } from "react";
import { Topology } from "../../context/TopologyPageContext";
import { typeItems, severityItems } from "../Incidents/data";
import { StatusLine, StatusLineProps } from "../StatusLine/StatusLine";

const chipColorFromIndex = (
  index: number
): "green" | "orange" | "red" | "gray" => {
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
          severityItems[key as IncidentSummarySeverity] || severityItems.Low;
        const item = {
          label: value.toString(),
          color: chipColorFromIndex(i),
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
