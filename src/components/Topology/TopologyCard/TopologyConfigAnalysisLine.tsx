import { useMemo } from "react";
import { MdOutlineInsights } from "react-icons/md";
import { InsightTypeToIcon } from "../../Configs/Insights/ConfigInsightsIcon";
import {
  StatusInfo,
  StatusLine,
  StatusLineData
} from "../../StatusLine/StatusLine";
import { Topology } from "../../../api/types/topology";

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

type TopologyConfigAnalysisLineProps = {
  target?: string;
  topology: Pick<Topology, "summary" | "id">;
};

export function TopologyConfigAnalysisLine({
  topology,
  target = ""
}: TopologyConfigAnalysisLineProps) {
  const insights = topology?.summary?.insights;

  const analysis: StatusLineData = useMemo(() => {
    if (!insights) {
      return {
        icon: <MdOutlineInsights className="h-4 w-4" />,
        label: "Insights",
        statuses: []
      };
    }
    const analysisToCountMap: Record<string, StatusInfo> = {};

    Object.entries(insights).forEach(([type, severityMap]) => {
      const severityMapWithLowMediumCombined: typeof severityMap = {
        ...severityMap,
        medium: (severityMap.medium ?? 0) + (severityMap.low ?? 0),
        low: undefined
      };
      Object.entries(severityMapWithLowMediumCombined)
        .filter(([_, count]) => count !== undefined)
        .forEach(([severity, count], index) => {
          const color = severityToColorMap(severity);
          // Only show icon for first insight, otherwise it's too much
          const icon =
            index === 0 ? <InsightTypeToIcon type={type} size={17} /> : null;
          const label = count ?? 0;
          const key = `${type}-${severity}`;
          const url = `/catalog/insights?component=${topology.id}&type=${type}&severity=${severity}`;
          analysisToCountMap[key] = {
            color,
            icon,
            label,
            url
          };
        });
    });

    return {
      icon: <MdOutlineInsights className="h-4 w-4" />,
      label: "Insights",
      url: `/catalog/insights?component=${topology.id}`,
      statuses: Object.values(analysisToCountMap)
    };
  }, [insights, topology.id]);

  if (!insights) {
    return null;
  }

  return <StatusLine {...analysis} className="" target={target} />;
}
