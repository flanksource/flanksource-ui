import { useMemo, useState } from "react";
import { useGetTopologyRelatedInsightsQuery } from "../../api/query-hooks";
import { InsightTypeToIcon } from "../ConfigInsightsIcon";
import { MdOutlineInsights } from "react-icons/md";
import {
  StatusInfo,
  StatusLine,
  StatusLineData
} from "../StatusLine/StatusLine";
import InsightsDetails from "../Insights/Insights";
import { Modal } from "../Modal";

type TopologyConfigAnalysisLineProps = React.HTMLProps<HTMLDivElement> & {
  topologyId: string;
};

const severityToColorMap = (severity: string) => {
  if (severity === "critical") {
    return "red";
  }
  if (severity === "warning") {
    return "orange";
  }
  return "gray";
};

export function TopologyConfigAnalysisLine({
  topologyId,
  className,
  ...props
}: TopologyConfigAnalysisLineProps) {
  const { data: topologyInsights, isLoading } =
    useGetTopologyRelatedInsightsQuery(topologyId);
  const [openModal, setOpenModal] = useState(false);

  const analysis: StatusLineData = useMemo(() => {
    const analysisToCountMap: Record<string, StatusInfo> = {};
    topologyInsights?.data?.forEach((topologyInsight) => {
      analysisToCountMap[topologyInsight.analysis_type] = analysisToCountMap[
        topologyInsight.analysis_type
      ] || {
        label: 0,
        color: severityToColorMap(topologyInsight.severity),
        icon: (
          <InsightTypeToIcon type={topologyInsight.analysis_type} size={17} />
        )
      };
      (analysisToCountMap[topologyInsight.analysis_type].label as number) += 1;
    });
    return {
      icon: <MdOutlineInsights className="w-4 h-4" />,
      label: "Insights",
      statuses: Object.values(analysisToCountMap)
    };
  }, [topologyInsights]);

  if (!analysis?.statuses?.length) {
    return null;
  }

  return (
    <>
      <StatusLine
        {...analysis}
        className=""
        onClick={(e) => setOpenModal(true)}
      />
      <Modal
        onClose={() => {
          setOpenModal(false);
        }}
        title={
          <span className="flex space-x-1 flex-row items-center">
            <MdOutlineInsights className="w-5 h-5" />
            <span>Config Insights</span>
          </span>
        }
        open={openModal}
        size="slightly-small"
        containerClassName=""
        bodyClass=""
      >
        <div
          className="flex flex-col divide-y divide-gray-200 space-y-4 p-2 overlow-y-auto"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <InsightsDetails type="topologies" topologyId={topologyId} />
        </div>
      </Modal>
    </>
  );
}
