import { useMemo } from "react";
import { IncidentSeverity } from "../../../api/types/incident";

import { Topology } from "../../../api/types/topology";
import { StatusLine, StatusLineProps } from "../../StatusLine/StatusLine";
import { severityItems, typeItems } from "../data";

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
  target?: string;
  topology: Pick<Topology, "summary" | "id">;
};

export default function IncidentCardSummary({
  topology,
  target = ""
}: IncidentCardSummaryProps) {
  const statusLines: StatusLineProps[] = useMemo(() => {
    const incidentSummary = Object.entries(topology?.summary?.incidents || {});
    return incidentSummary.map(([key, summary]) => {
      // For presentation purposes, we combine Low and Medium into one
      const { Low, ...rest } = summary;
      const summaryWithLowMediumCombined = {
        ...rest,
        Medium: (summary.Medium ?? 0) + (summary.Low ?? 0)
      };
      const statusLine: StatusLineProps = {
        icon: typeItems[key as IncidentSummaryTypes].icon,
        label: typeItems[key as IncidentSummaryTypes].description,
        url: `/incidents?type=${key}&component=${topology.id}`,
        statuses: []
      };
      const type = typeItems[key as IncidentSummaryTypes].value;
      Object.entries(summaryWithLowMediumCombined).forEach(
        ([key, value], i) => {
          if (value <= 0) {
            return;
          }
          const severityObject =
            Object.values(severityItems).find(
              (values) => values.value === key
            ) || severityItems.Low;
          const item = {
            label: value.toString(),
            color: chipColorFromSeverity(key as IncidentSeverity),
            url: `/incidents?severity=${severityObject.value}&component=${topology.id}&type=${type}`
          };
          statusLine.statuses.push(item);
        }
      );
      return statusLine;
    });
  }, [topology]);

  if (!topology.summary?.incidents) {
    return null;
  }

  return (
    <>
      {statusLines.map((statusLine, index) => {
        return (
          <StatusLine
            key={index}
            {...statusLine}
            className=""
            target={target}
          />
        );
      })}
    </>
  );
}
