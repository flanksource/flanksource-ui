import { CellContext } from "@tanstack/react-table";
import { useEffect } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import { ConfigItem } from "../../../api/services/configs";

function AnalysisIcon({ analysis }: { analysis: ConfigItem["analysis"][0] }) {
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
  }
  return <AiFillWarning color={color} size="20" />;
}

export default function ConfigListAnalysisCell({
  row,
  column
}: CellContext<ConfigItem, unknown>) {
  const analysis = row?.getValue<ConfigItem["analysis"]>(column.id) || [];

  useEffect(() => {
    if (analysis.length > 0) {
      ReactTooltip.rebuild();
    }
  });

  if (analysis.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-full">
      {analysis.map((item, index) => (
        <div
          data-tip={`${item.analyzer}`}
          className="flex flex-row space-x-2 pb-0.5 max-w-full"
          key={index}
        >
          <span className="w-auto">
            <AnalysisIcon analysis={item} />
          </span>
          <span className="flex-1 overflow-hidden overflow-ellipsis">
            {item.analyzer}
          </span>
        </div>
      ))}
    </div>
  );
}
