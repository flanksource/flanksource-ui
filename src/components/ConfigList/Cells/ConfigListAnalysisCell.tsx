import { CellContext } from "@tanstack/react-table";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { ConfigItem } from "../../../api/services/configs";
import Popover from "../../Popover/Popover";

export function AnalysisIcon({
  analysis
}: {
  analysis: {
    analysis_type: string;
    severity: string;
  };
}) {
  let color = "44403c";

  if (analysis.severity === "critical") {
    color = "#f87171";
  } else if (analysis.severity === "warning") {
    color = "#fb923c";
  } else if (analysis.severity === "info") {
    color = "#44403c";
  }

  switch (analysis.analysis_type) {
    case "cost":
      return <BiDollarCircle color={color} size="20" title="Cost" />;
    case "availability":
      return <ImHeartBroken color={color} size="20" title="Availability" />;
    case "performance":
      return <IoMdSpeedometer color={color} size="20" title="Performance" />;
    case "security":
      return <MdSecurity color={color} size="20" title="Security" />;
    case "integration":
      return <GrIntegration color={color} size="20" title="Integration" />;
    case "compliance":
      return <FaTasks color={color} size="20" title="Compliance" />;
    case "technicalDebt":
      return <GrWorkshop color={color} size="20" title="Technical Debt" />;
    case "reliability":
      return <FaRegClock color={color} size="20" title="Reliability" />;
  }
  return <AiFillWarning color={color} size="20" />;
}

export default function ConfigListAnalysisCell({
  row,
  column
}: CellContext<ConfigItem, unknown>) {
  const analysis = row?.getValue<ConfigItem["analysis"]>(column.id) || [];

  if (analysis.length === 0) {
    return null;
  }

  return (
    <Popover
      toggle={
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center flex-shrink space-x-1 truncate">
            <span className="w-auto">
              <AnalysisIcon analysis={analysis[0]} />
            </span>
            <span className="flex-1">{analysis[0].analyzer}</span>
          </div>
          {analysis.length > 1 && (
            <div className="flex-shrink underline decoration-solid justify-left text-xs mx-2">
              +{analysis.length - 1} more
            </div>
          )}
        </div>
      }
      placement="left"
      title="Analysis"
    >
      <div className="flex flex-col w-full max-w-full space-y-2 p-3">
        {analysis.map((item, index) => (
          <div className="flex flex-row space-x-2 max-w-full" key={index}>
            <span className="w-auto">
              <AnalysisIcon analysis={item} />
            </span>
            <span className="flex-1 overflow-hidden overflow-ellipsis">
              {item.analyzer}
            </span>
          </div>
        ))}
      </div>
    </Popover>
  );
}
