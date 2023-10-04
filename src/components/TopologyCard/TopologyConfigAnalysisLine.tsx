import { useMemo } from "react";
import { MdOutlineInsights } from "react-icons/md";
import { Topology } from "../../context/TopologyPageContext";
import { InsightTypeToIcon } from "../ConfigInsightsIcon";
import {
  StatusInfo,
  StatusLine,
  StatusLineData
} from "../StatusLine/StatusLine";

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
  topology: Pick<Topology, "summary" | "id">;
};

export function TopologyConfigAnalysisLine({
  topology
}: TopologyConfigAnalysisLineProps) {
  const insights = topology?.summary?.insights;

  const analysis: StatusLineData = useMemo(() => {
    if (!insights) {
      return {
        icon: <MdOutlineInsights className="w-4 h-4" />,
        label: "Insights",
        statuses: []
      };
    }
    const analysisToCountMap: Record<string, StatusInfo> = {};

    Object.entries(insights).forEach(([type, severityMap]) => {
      Object.entries(severityMap).forEach(([severity, count]) => {
        const color = severityToColorMap(severity) as any;
        const icon = <InsightTypeToIcon type={type} size={17} />;
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
      icon: <MdOutlineInsights className="w-4 h-4" />,
      label: "Insights",
      url: `/catalog/insights?component=${topology.id}`,
      statuses: Object.values(analysisToCountMap)
    };
  }, [insights, topology.id]);

  if (!insights) {
    return null;
  }

  return <StatusLine {...analysis} className="" />;
}
