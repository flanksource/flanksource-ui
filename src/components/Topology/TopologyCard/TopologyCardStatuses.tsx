import { IncidentSeverity } from "@flanksource-ui/api/types/incident";
import { Topology } from "@flanksource-ui/api/types/topology";
import { InsightTypeToIcon } from "@flanksource-ui/components/Configs/Insights/ConfigInsightsIcon";
import {
  severityItems,
  typeItems
} from "@flanksource-ui/components/Incidents/data";
import {
  StatusInfo,
  StatusLine,
  StatusLineProps
} from "@flanksource-ui/components/StatusLine/StatusLine";
import { CustomScroll } from "@flanksource-ui/ui/CustomScroll";
import clsx from "clsx";
import { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineInsights } from "react-icons/md";

const severityToColorMap = (severity: string) => {
  if (severity === "critical") {
    return "red";
  }
  if (severity === "high") {
    return "orange";
  }
  if (severity === "warning") {
    return "yellow";
  }
  if (severity === "info") {
    return "gray";
  }
  if (severity === "low") {
    return "green";
  }
  if (severity === "medium") {
    return "green";
  }
  return "gray";
};

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

function getStatuses(summary?: Topology["summary"], url?: string) {
  if (!summary) {
    return [];
  }
  const statuses: StatusInfo[] = [];
  if (summary.healthy && summary.healthy > 0) {
    statuses.push({
      url: url ? `${url}?status=healthy` : "",
      label: summary.healthy.toString(),
      color: "green"
    });
  }
  if (summary.unhealthy && summary.unhealthy > 0) {
    statuses.push({
      url: url ? `${url}?status=unhealthy` : "",
      label: summary.unhealthy.toString(),
      color: "red"
    });
  }
  if (summary.warning && summary.warning > 0) {
    statuses.push({
      url: url ? `${url}?status=warning` : "",
      label: summary.warning.toString(),
      color: "orange"
    });
  }
  if (summary.unknown && summary.unknown > 0) {
    statuses.push({
      url: url ? `${url}?status=unknown` : "",
      label: summary.unknown.toString(),
      color: "gray"
    });
  }
  return statuses;
}

function insightStatuses(topology: Topology): StatusLineProps | undefined {
  const insights = topology?.summary?.insights;
  if (!insights) {
    return undefined;
  }

  const analysisToCountMap = Object.entries(insights)
    .map(([type, severityMap]) => {
      const severityMapWithLowMediumCombined = {
        ...severityMap,
        medium: (severityMap.medium ?? 0) + (severityMap.low ?? 0),
        low: undefined
      };

      return Object.entries(severityMapWithLowMediumCombined)
        .filter(([_, count]) => count)
        .map(([severity, count], index) => {
          const icon =
            index === 0 ? <InsightTypeToIcon type={type} size={17} /> : null;
          const label = count ?? 0;
          //   const key = `${type}-${severity}`;
          const url = `/catalog/insights?component=${topology.id}&type=${type}&severity=${severity}`;
          return {
            color: severityToColorMap(severity as IncidentSeverity),
            icon,
            label,
            url
          } satisfies StatusInfo;
        });
    })
    .flatMap((x) => x);

  return {
    icon: <MdOutlineInsights className="h-4 w-4" />,
    label: "Insights",
    url: `/catalog/insights?component=${topology.id}`,
    statuses: Object.values(analysisToCountMap)
  };
}

// checked and looks good
function getTopologyHealthStatuses(topology: Topology) {
  if (!topology?.summary?.checks) {
    return undefined;
  }

  const checks = topology.summary.checks;

  const data: StatusLineProps = {
    label: "Health Checks",
    icon: <AiFillHeart className="inline-block h-4 w-4" />,
    url: "/health",
    statuses: [
      ...(checks.healthy > 0
        ? [
            {
              label: checks.healthy.toString(),
              color: "green" as const
            }
          ]
        : []),
      ...(checks.unhealthy > 0
        ? [
            {
              label: checks.unhealthy.toString(),
              color: "red" as const
            }
          ]
        : []),
      ...(checks.warning > 0
        ? [{ label: checks.warning, color: "orange" as const }]
        : [])
    ]
  };

  return data;
}

export function getTopologyHealthSummary(
  topology: Topology,
  viewType: "individual_level" | "children_level"
) {
  const data: StatusLineProps = {
    icon: "",
    label: "",
    url: "",
    statuses: []
  };
  const childrenSummary = {
    healthy: 0,
    unhealthy: 0,
    warning: 0
  };
  topology.components?.forEach((component) => {
    childrenSummary.healthy += component.summary?.checks?.healthy || 0;
    childrenSummary.unhealthy += component.summary?.checks?.unhealthy || 0;
    childrenSummary.warning += component.summary?.checks?.warning || 0;
  });
  const noSummary = !(
    childrenSummary.healthy ||
    childrenSummary.unhealthy ||
    childrenSummary.warning
  );
  if (viewType === "individual_level") {
    data.icon = topology.icon;
    data.label = topology.name;
    data.url = `/topology/${topology.id}`;
    data.statuses = getStatuses(topology?.summary, `/topology/${topology.id}`);
  } else {
    data.label = `Health Summary: ${noSummary ? "NA" : ""}`;
    data.statuses = getStatuses(childrenSummary);
  }
  return data;
}

export function topologiesHealthSummaries(topology: Topology) {
  return topology?.components
    ?.sort((a, b) => {
      // we want to move unhealthy components to the top, then warning, then healthy
      if (a.status === "unhealthy" && b.status !== "unhealthy") {
        return -1;
      }
      if (a.status === "warning" && b.status === "healthy") {
        return -1;
      }
      if (a.status === "healthy" && b.status !== "healthy") {
        return 1;
      }
      return 0;
    })
    .map((component) =>
      getTopologyHealthSummary(component, "individual_level")
    );
}

// checked and looks good
function incidentsStatuses(topology: Topology) {
  type IncidentSummaryTypes = keyof typeof typeItems;

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
    Object.entries(summaryWithLowMediumCombined).forEach(([key, value], i) => {
      if (value <= 0) {
        return;
      }
      const severityObject =
        Object.values(severityItems).find((values) => values.value === key) ||
        severityItems.Low;
      const item = {
        label: value.toString(),
        color: chipColorFromSeverity(key as IncidentSeverity),
        url: `/incidents?severity=${severityObject.value}&component=${topology.id}&type=${type}`
      };
      statusLine.statuses.push(item);
    });
    return statusLine;
  });
}

type TopologyCardStatusesProps = {
  topology?: Topology;
  isPropertiesPanelEmpty: boolean;
};

export default function TopologyCardStatuses({
  topology,
  isPropertiesPanelEmpty = false
}: TopologyCardStatusesProps) {
  const statusLines = useMemo(() => {
    if (!topology) {
      return [];
    }

    const healthChecks = getTopologyHealthStatuses(topology);
    const insights = insightStatuses(topology);
    const incidents = incidentsStatuses(topology) ?? [];
    const components = topologiesHealthSummaries(topology) ?? [];

    return (
      [healthChecks, insights, ...incidents, ...components]
        .filter((status) => status)
        //   remove empty statuses
        .filter((status) => status!.statuses.length > 0)
        .sort((a, b) => {
          // count the number of red statuses
          // if a has more red statuses than b, a should come first
          // if b has more red statuses than a, b should come first
          // if they have the same number of red statuses, compare the number of orange statuses
          // if a has more orange statuses than b, a should come first
          // if b has more orange statuses than a, b should come first
          // if they have the same number of orange statuses, sort by
          // alphabetical
          const aRed = parseInt(
            a?.statuses
              ?.find((status) => status.color === "red")
              ?.label.toString() ?? "0"
          );

          const bRed = parseInt(
            b?.statuses
              ?.find((status) => status.color === "red")
              ?.label.toString() ?? "0"
          );

          if (aRed > bRed) {
            return -1;
          }

          if (aRed < bRed) {
            return 1;
          }

          const aOrange = parseInt(
            a?.statuses
              .find((status) => status.color === "orange")
              ?.label.toString() ?? "0"
          );

          const bOrange = parseInt(
            b?.statuses
              .find((status) => status.color === "orange")
              ?.label.toString() ?? "0"
          );

          if (aOrange > bOrange) {
            return -1;
          }

          if (aOrange < bOrange) {
            return 1;
          }

          const aYellow = parseInt(
            a?.statuses
              .find((status) => status.color === "red")
              ?.label.toString() ?? "0"
          );

          const bYellow = parseInt(
            b?.statuses
              .find((status) => status.color === "red")
              ?.label.toString() ?? "0"
          );

          if (aYellow > bYellow) {
            return -1;
          }

          if (aYellow < bYellow) {
            return 1;
          }

          const aGray = parseInt(
            a?.statuses
              .find((status) => status.color === "gray")
              ?.label.toString() ?? "0"
          );

          const bGray = parseInt(
            b?.statuses
              .find((status) => status.color === "gray")
              ?.label.toString() ?? "0"
          );

          if (aGray > bGray) {
            return -1;
          }

          if (aGray < bGray) {
            return 1;
          }

          return a!.label.localeCompare(b!.label);
        }) as StatusLineProps[]
    );

    // we want to take all status and add them to a list
    // then sort by unhealthy, then alphabetical order
  }, [topology]);

  if (statusLines?.length === 0) {
    return null;
  }

  return (
    <CustomScroll
      className={clsx(
        "flex-1 py-2 pl-2 pr-2",
        isPropertiesPanelEmpty ? "grid grid-cols-2" : ""
      )}
      showMoreClass="text-xs linear-1.21rel mr-1 cursor-pointer"
      maxHeight="200px"
      // When we showing two columns, we need to show more items
      minChildCount={isPropertiesPanelEmpty ? 5 : 10}
    >
      {statusLines.map((status, index) => (
        <StatusLine {...status} key={index} />
      ))}
    </CustomScroll>
  );
}
