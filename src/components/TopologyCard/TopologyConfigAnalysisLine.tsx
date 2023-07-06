import { useMemo, useState } from "react";
import { InsightTypeToIcon } from "../ConfigInsightsIcon";
import { MdOutlineInsights } from "react-icons/md";
import {
  StatusInfo,
  StatusLine,
  StatusLineData
} from "../StatusLine/StatusLine";
import { Topology } from "../../context/TopologyPageContext";
import InsightsDetails from "../Insights/Insights";
import { Modal } from "../Modal";

const severityToColorMap = (severity: string) => {
  if (severity === "critical") {
    return "red";
  }
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        analysisToCountMap[key] = {
          color,
          icon,
          label
        };
      });
    });

    return {
      icon: <MdOutlineInsights className="w-4 h-4" />,
      label: "Insights",
      statuses: Object.values(analysisToCountMap)
    };
  }, [insights]);

  if (!insights) {
    return null;
  }

  return (
    <>
      <StatusLine
        {...analysis}
        className=""
        onClick={(e) => setIsModalOpen(true)}
      />
      <Modal
        onClose={() => {
          setIsModalOpen(false);
        }}
        title={
          <span className="flex space-x-1 flex-row items-center">
            <MdOutlineInsights className="w-5 h-5" />
            <span>Config Insights</span>
          </span>
        }
        open={isModalOpen}
        size="slightly-small"
        containerClassName=""
        bodyClass=""
      >
        <div
          className="flex flex-col divide-y divide-gray-200 space-y-4 p-2 overlow-y-auto"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <InsightsDetails type="topologies" topologyId={topology.id} />
        </div>
      </Modal>
    </>
  );
}
